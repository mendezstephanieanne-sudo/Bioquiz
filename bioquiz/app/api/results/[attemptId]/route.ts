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
      include: { category: true, user: true },
    });
    if (!attempt) return NextResponse.json({ error: "Result not found." }, { status: 404 });

    return NextResponse.json({
      success: true,
      result: {
        id: attempt.id,
        userName: attempt.user.name,
        category: attempt.category.name,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        status: attempt.status,
        startedAt: attempt.startedAt,
        finishedAt: attempt.finishedAt,
      },
    });
  } catch (error) {
    console.error("Result error:", error);
    return NextResponse.json({ error: "Unable to load result." }, { status: 500 });
  }
}