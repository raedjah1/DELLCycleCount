-- ============================================================================
-- RAW GOODS TABLE
-- ============================================================================
-- Stores raw goods inventory
-- Only stores: PartNo, AvailableQty, Bin (after first dot), PalletBoxNo, Warehouse

CREATE TABLE IF NOT EXISTS public.raw_goods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_no TEXT NOT NULL,
  available_qty INTEGER NOT NULL,
  bin TEXT NOT NULL, -- Bin location (stored as-is from Excel)
  pallet_box_no TEXT,
  warehouse TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(part_no, bin, warehouse, pallet_box_no) -- Prevent duplicates
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_raw_goods_part_no ON public.raw_goods(part_no);
CREATE INDEX IF NOT EXISTS idx_raw_goods_bin ON public.raw_goods(bin);
CREATE INDEX IF NOT EXISTS idx_raw_goods_warehouse ON public.raw_goods(warehouse);

