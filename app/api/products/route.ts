import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validations/product";

function isPrismaUniqueError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "P2002"
  );
}

export async function POST(request: Request) {
  try {
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

    const product = await prisma.product.create({
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
        message: "Product created successfully.",
        product,
      },
      { status: 201 },
    );
  } catch (error) {
    if (isPrismaUniqueError(error)) {
      return NextResponse.json(
        { message: "SKU already exists." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { message: "Unable to create product." },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch products." },
      { status: 500 },
    );
  }
}
