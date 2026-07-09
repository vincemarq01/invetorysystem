import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

function isPrismaRecordNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2025"
  );
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id: idParam } = await params;
  const id = String(idParam);

  try {
    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 },
      );
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully." },
      { status: 200 },
    );
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: "Unable to delete product." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request, { params }: Params) {
  const { id: idParam } = await params;
  const id = String(idParam);

  try {
    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required." },
        { status: 400 },
      );
    }

    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Invalid product data.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const productData = parsed.data;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: productData.name,
        sku: productData.sku.toUpperCase(),
        categoryId: productData.categoryId,
        brandId: productData.brandId || null,
        supplierId: productData.supplierId || null,
        model: productData.model || null,
        quantity: productData.quantity,
        reorderLevel: productData.reorderLevel,
        costPrice: productData.costPrice,
        sellingPrice: productData.sellingPrice,
        warrantyMonths: productData.warrantyMonths ?? null,
        location: productData.location || null,
        description: productData.description || null,
      },
    });

    return NextResponse.json(
      {
        message: "Product updated successfully.",
        product,
      },
      { status: 200 },
    );
  } catch (error) {
    if (isPrismaRecordNotFoundError(error)) {
      return NextResponse.json(
        { message: "Product not found." },
        { status: 404 },
      );
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "SKU already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Unable to update product." },
      { status: 500 },
    );
  }
}
