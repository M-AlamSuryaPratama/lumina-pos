ALTER TABLE public.store_settings 
ADD COLUMN store_address text DEFAULT '' NOT NULL,
ADD COLUMN store_phone text DEFAULT '' NOT NULL;