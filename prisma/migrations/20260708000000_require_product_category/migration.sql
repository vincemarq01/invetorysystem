-- Seed core PC-part categories so products can always pick one.
INSERT INTO "categories" ("id", "name", "created_at", "updated_at")
VALUES
  ('cat_processors', 'Processors', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_motherboards', 'Motherboards', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_memory', 'Memory', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_graphics_cards', 'Graphics Cards', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_storage', 'Storage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_power_supplies', 'Power Supplies', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_cases', 'Cases', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_cooling', 'Cooling', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_peripherals', 'Peripherals', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('cat_displays', 'Displays', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("name") DO NOTHING;

-- Existing products without a category are moved to a real category before
-- making category_id required.
UPDATE "products"
SET "category_id" = 'cat_peripherals'
WHERE "category_id" IS NULL;

ALTER TABLE "products"
DROP CONSTRAINT IF EXISTS "products_category_id_fkey";

ALTER TABLE "products"
ALTER COLUMN "category_id" SET NOT NULL;

ALTER TABLE "products"
ADD CONSTRAINT "products_category_id_fkey"
FOREIGN KEY ("category_id") REFERENCES "categories"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
