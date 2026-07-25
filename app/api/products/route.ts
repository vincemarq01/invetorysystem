import { NextResponse } from "next/server";
import { getProducts } from "@/lib/products/product-service";

export async function GET() {
  try {
    const products = await getProducts();

    return NextResponse.json({ products }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Unable to fetch products." },
      { status: 500 },
    );
  }
}
