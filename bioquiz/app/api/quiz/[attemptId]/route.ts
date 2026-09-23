import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = { params: Promise<{ attemptId: string }> };

export async function GET(request: Request, { params }: Props) {
  try {
    const { attemptId } = await params;
    const id = Number(attemptId);
    if (!id) return NextResponse.json({ error: "Invalid attempt ID." }, { status: 400 });

    const attempt = await prisma.quizAttempt.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!attempt) return NextResponse.json({ error: "Quiz attempt not found." }, { status: 404 });

    const questions = await prisma.question.findMany({
      where: { categoryId: attempt.categoryId },
      select: {
        id: true,
        question: true,
        difficulty: true,
        choices: { select: { id: true, text: true } },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt.id,
        status: attempt.status,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        category: attempt.category.name,
      },
      questions,
    });
  } catch (error) {
    console.error("Get quiz error:", error);
    return NextResponse.json({ error: "Unable to load quiz." }, { status: 500 });
  }
}
