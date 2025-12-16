-- ============================================================================
-- FINISHED GOODS TABLE
-- ============================================================================
-- Stores finished goods inventory with serial numbers
-- Only stores: Part Number, Serial No, Part Location (from ARB onwards), Warehouse, Pallet Box No

CREATE TABLE IF NOT EXISTS public.finished_goods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  part_number TEXT NOT NULL,
  serial_no TEXT NOT NULL,
  part_location TEXT NOT NULL, -- Location from ARB onwards (e.g., ARB.H0.0.0)
  warehouse TEXT NOT NULL,
  pallet_box_no TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(part_number, serial_no, part_location, warehouse) -- Prevent duplicates
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_finished_goods_part_number ON public.finished_goods(part_number);
CREATE INDEX IF NOT EXISTS idx_finished_goods_serial_no ON public.finished_goods(serial_no);
CREATE INDEX IF NOT EXISTS idx_finished_goods_location ON public.finished_goods(part_location);
CREATE INDEX IF NOT EXISTS idx_finished_goods_warehouse ON public.finished_goods(warehouse);
