import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ attemptId: string }> };

export async function POST(request: Request, { params }: Props) {
  try {
    const { attemptId } = await params;
    const id = Number(attemptId);
    const body = await request.json();
    const questionId = Number(body.questionId);
    const choiceId = Number(body.choiceId);
    if (!id || !questionId || !choiceId) return NextResponse.json({ error: "Invalid answer data." }, { status: 400 });

    const attempt = await prisma.quizAttempt.findUnique({ where: { id } });
    if (!attempt) return NextResponse.json({ error: "Quiz attempt not found." }, { status: 404 });
    if (attempt.status !== "IN_PROGRESS") return NextResponse.json({ error: "This quiz has already been submitted." }, { status: 400 });

    const question = await prisma.question.findFirst({ where: { id: questionId, categoryId: attempt.categoryId } });
    if (!question) return NextResponse.json({ error: "Question does not belong to this quiz." }, { status: 400 });
    const choice = await prisma.choice.findFirst({ where: { id: choiceId, questionId } });
    if (!choice) return NextResponse.json({ error: "Invalid choice." }, { status: 400 });

    const existingAnswer = await prisma.answer.findFirst({ where: { attemptId: id, questionId } });
    if (existingAnswer) {
      await prisma.answer.update({ where: { id: existingAnswer.id }, data: { choiceId, isCorrect: choice.isCorrect } });
    } else {
      await prisma.answer.create({ data: { attemptId: id, questionId, choiceId, isCorrect: choice.isCorrect } });
    }
    return NextResponse.json({ success: true, isCorrect: choice.isCorrect });
  } catch (error) {
    console.error("Answer error:", error);
    return NextResponse.json({ error: "Unable to save answer." }, { status: 500 });
  }
}
