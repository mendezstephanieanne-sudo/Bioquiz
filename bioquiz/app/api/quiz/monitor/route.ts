import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const attempts = await prisma.quizAttempt.findMany({
      orderBy: {
        startedAt: "desc",
      },
      take: 20,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        answers: {
          select: {
            id: true,
            questionId: true,
            choiceId: true,
            isCorrect: true,
          },
        },
      },
    });

    const monitoringData = attempts.map((attempt) => ({
      id: attempt.id,
      user: attempt.user,
      category: attempt.category.name,

      status: attempt.status,

      score: attempt.score,

      totalQuestions: attempt.totalQuestions,

      answeredQuestions: attempt.answers.length,

      correctAnswers: attempt.answers.filter(
        (answer) => answer.isCorrect
      ).length,

      startedAt: attempt.startedAt,

      finishedAt: attempt.finishedAt,

      progress: Math.round(
        (attempt.answers.length / attempt.totalQuestions) * 100
      ),
    }));

    return NextResponse.json({
      success: true,
      attempts: monitoringData,
    });
  } catch (error) {
    console.error("Monitor error:", error);

    return NextResponse.json(
      {
        error: "Unable to load monitoring data.",
      },
      {
        status: 500,
      }
    );
  }
}