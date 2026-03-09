-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  price DECIMAL(12,2) NOT NULL DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  total DECIMAL(12,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create transaction_items table
CREATE TABLE public.transaction_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(12,2) NOT NULL,
  subtotal DECIMAL(12,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transaction_items ENABLE ROW LEVEL SECURITY;

-- Public read policies (POS system is typically internal)
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Anyone can manage categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view transactions" ON public.transactions FOR SELECT USING (true);
CREATE POLICY "Anyone can manage transactions" ON public.transactions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can view transaction_items" ON public.transaction_items FOR SELECT USING (true);
CREATE POLICY "Anyone can manage transaction_items" ON public.transaction_items FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX idx_products_category ON public.products(category_id);
CREATE INDEX idx_transaction_items_transaction ON public.transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product ON public.transaction_items(product_id);

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
  ('Makanan', 'Berbagai jenis makanan'),
  ('Minuman', 'Berbagai jenis minuman'),
  ('Snack', 'Camilan dan makanan ringan');

-- Insert sample products
INSERT INTO public.products (category_id, name, price, stock, image_url)
SELECT c.id, p.name, p.price, p.stock, p.image_url
FROM public.categories c
CROSS JOIN (VALUES
  ('Makanan', 'Nasi Goreng', 25000, 50, 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=300'),
  ('Makanan', 'Mie Ayam', 20000, 40, 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300'),
  ('Makanan', 'Ayam Bakar', 35000, 30, 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=300'),
  ('Minuman', 'Es Teh Manis', 5000, 100, 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300'),
  ('Minuman', 'Kopi Susu', 15000, 80, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300'),
  ('Minuman', 'Jus Jeruk', 12000, 60, 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=300'),
  ('Snack', 'Kentang Goreng', 15000, 45, 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300'),
  ('Snack', 'Roti Bakar', 12000, 35, 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300')
) AS p(category, name, price, stock, image_url)
WHERE c.name = p.category;