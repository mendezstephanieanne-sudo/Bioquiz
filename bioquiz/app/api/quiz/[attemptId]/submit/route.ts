import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ attemptId: string }> };

export async function POST(request: Request, { params }: Props) {
  try {
    const { attemptId } = await params;
    const id = Number(attemptId);
    if (!id) return NextResponse.json({ error: "Invalid attempt ID." }, { status: 400 });

    const attempt = await prisma.quizAttempt.findUnique({ where: { id }, include: { answers: true } });
    if (!attempt) return NextResponse.json({ error: "Quiz attempt not found." }, { status: 404 });
    if (attempt.status === "COMPLETED") return NextResponse.json({ success: true, score: attempt.score, totalQuestions: attempt.totalQuestions });

    const score = attempt.answers.filter((answer) => answer.isCorrect).length;
    const updatedAttempt = await prisma.quizAttempt.update({ where: { id }, data: { score, status: "COMPLETED", finishedAt: new Date() } });
    return NextResponse.json({ success: true, score: updatedAttempt.score, totalQuestions: updatedAttempt.totalQuestions });
  } catch (error) {
    console.error("Submit quiz error:", error);
    return NextResponse.json({ error: "Unable to submit quiz." }, { status: 500 });
  }
}
