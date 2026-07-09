-- Add new product fields for computer-parts inventory.
-- brand_id connects products to brands later.
-- model stores hardware model names like "RTX 4060 Dual" or "Ryzen 5 5600".
-- cost_price stores your buying/acquisition price.
-- selling_price stores your selling/list price.
-- warranty_months stores warranty length for parts.
ALTER TABLE "products"
ADD COLUMN "brand_id" TEXT,
ADD COLUMN "cost_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "model" VARCHAR(120),
ADD COLUMN "selling_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN "warranty_months" INTEGER;

-- Preserve old price data before removing the old price column.
-- For now, copy old price into both cost_price and selling_price.
-- You can manually adjust cost_price later if needed.
UPDATE "products"
SET
  "cost_price" = "price",
  "selling_price" = "price"
WHERE "price" IS NOT NULL;

-- Remove old generic price column after data has been copied.
ALTER TABLE "products"
DROP COLUMN "price";

-- Create product categories like CPU, GPU, RAM, SSD, Motherboard, PSU, etc.
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- Create brands like Intel, AMD, ASUS, MSI, Gigabyte, Corsair, Samsung, etc.
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- Prevent duplicate category names.
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- Prevent duplicate brand names.
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- Clear old category_id values before adding a real foreign key.
-- Existing category_id values may not match rows in the new categories table.
UPDATE "products"
SET "category_id" = NULL
WHERE "category_id" IS NOT NULL;

-- Speed up filtering products by category.
CREATE INDEX "products_category_id_idx" ON "products"("category_id");

-- Speed up filtering products by brand.
CREATE INDEX "products_brand_id_idx" ON "products"("brand_id");

-- Connect products.category_id to categories.id.
-- If a category is deleted, product.category_id becomes NULL.
ALTER TABLE "products"
ADD CONSTRAINT "products_category_id_fkey"
FOREIGN KEY ("category_id") REFERENCES "categories"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Connect products.brand_id to brands.id.
-- If a brand is deleted, product.brand_id becomes NULL.
ALTER TABLE "products"
ADD CONSTRAINT "products_brand_id_fkey"
FOREIGN KEY ("brand_id") REFERENCES "brands"("id")
ON DELETE SET NULL ON UPDATE CASCADE;