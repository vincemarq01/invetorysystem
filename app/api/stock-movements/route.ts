import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createStockMovementSchema } from "@/lib/validations/stock";

function getQuantityDelta(type: "STOCK_IN" | "STOCK_OUT" | "ADJUSTMENT", quantity: number) {
  if (type === "STOCK_IN") {
    return Math.abs(quantity);
  }

  if (type === "STOCK_OUT") {
    return -Math.abs(quantity);
  }

  return quantity;
}

export async function GET() {
  try {
    const movements = await prisma.stockMovement.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            quantity: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });

    return NextResponse.json({ movements }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch stock movements." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createStockMovementSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid stock movement data.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const movementData = parsed.data;
    const quantityDelta = getQuantityDelta(
      movementData.type,
      movementData.quantity,
    );

    const result = await prisma.$transaction(async (tx) => {
      const product = await tx.product.findUnique({
        where: {
          id: movementData.productId,
        },
        select: {
          id: true,
          quantity: true,
        },
      });

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const nextQuantity = product.quantity + quantityDelta;

      if (nextQuantity < 0) {
        throw new Error("INSUFFICIENT_STOCK");
      }

      const movement = await tx.stockMovement.create({
        data: {
          productId: movementData.productId,
          type: movementData.type,
          quantity: quantityDelta,
          note: movementData.note || null,
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              quantity: true,
            },
          },
        },
      });

      const updatedProduct = await tx.product.update({
        where: {
          id: movementData.productId,
        },
        data: {
          quantity: nextQuantity,
        },
        select: {
          id: true,
          quantity: true,
        },
      });

      return { movement, product: updatedProduct };
    });

    return NextResponse.json(
      {
        message: "Stock movement recorded successfully.",
        ...result,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    if (error instanceof Error && error.message === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        { message: "Not enough stock for this movement." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Unable to record stock movement." },
      { status: 500 },
    );
  }
}
