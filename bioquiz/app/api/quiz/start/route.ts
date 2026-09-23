import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const userId = Number(body.userId);
    const categoryId = Number(body.categoryId);
    const categoryName = typeof body.categoryName === "string" ? body.categoryName.trim() : "";

    if (!userId || (!categoryId && !categoryName)) {
      return NextResponse.json(
        {
          error: "User and category are required.",
        },
        {
          status: 400,
        }
      );
    }

    const category = categoryName
      ? await prisma.category.findUnique({ where: { name: categoryName } })
      : null;
    const resolvedCategoryId = category?.id ?? categoryId;

    if (!resolvedCategoryId) {
      return NextResponse.json({ error: "Category not found." }, { status: 404 });
    }

    const questions = await prisma.question.findMany({
      where: {
        categoryId: resolvedCategoryId,
      },
      select: {
        id: true,
      },
    });

    if (questions.length === 0) {
      return NextResponse.json(
        {
          error: "No questions found.",
        },
        {
          status: 404,
        }
      );
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        categoryId: resolvedCategoryId,
        totalQuestions: questions.length,
        status: "IN_PROGRESS",
      },
    });

    return NextResponse.json({
      success: true,
      attemptId: attempt.id,
    });
  } catch (error) {
    console.error("Start quiz error:", error);

    return NextResponse.json(
      {
        error: "Unable to start quiz.",
      },
      {
        status: 500,
      }
    );
  }
}