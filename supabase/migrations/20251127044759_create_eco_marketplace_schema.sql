/*
  # Eco Marketplace Database Schema

  ## Overview
  Creates the complete database schema for the Eco Marketplace B2B PCR Materials platform.

  ## Tables Created
  
  1. **users**
     - id (uuid, primary key)
     - name (text)
     - email (text, unique)
     - password (text, hashed)
     - role (text: 'user' or 'admin')
     - phone_number (text, optional)
     - address, city, state, pincode (text, optional)
     - created_at, updated_at (timestamptz)

  2. **industries**
     - id (uuid, primary key)
     - name (text, unique)
     - slug (text, unique)
     - description (text)
     - icon (text, optional)
     - display_order (integer, default 0)
     - is_active (boolean, default true)
     - created_at, updated_at (timestamptz)

  3. **materials**
     - id (uuid, primary key)
     - industry_id (uuid, foreign key to industries)
     - name (text)
     - material_code (text, unique, auto-generated)
     - description (text)
     - price (decimal)
     - unit (text: 'kg', 'ton', 'piece')
     - stock_quantity (integer)
     - min_order_quantity (integer, default 1)
     - attributes (jsonb, for dynamic properties)
     - images (text[], array of image URLs)
     - is_featured (boolean, default false)
     - is_active (boolean, default true)
     - created_at, updated_at (timestamptz)

  4. **buyer_requests**
     - id (uuid, primary key)
     - request_id (text, unique, auto-generated)
     - material_id (uuid, foreign key to materials)
     - buyer_name (text)
     - buyer_email (text, optional)
     - buyer_mobile (text, optional)
     - company_name (text)
     - requested_quantity (decimal)
     - requested_unit (text)
     - additional_notes (text, optional)
     - status (text: 'New', 'Reviewed', 'Confirmed', 'Dispatched', 'Completed', 'Cancelled')
     - admin_notes (text, optional)
     - created_at, updated_at (timestamptz)

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Policies ensure proper access control
  - Admin role for management, public read for industries/materials
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  phone_number text DEFAULT '',
  address text DEFAULT '',
  city text DEFAULT '',
  state text DEFAULT '',
  pincode text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Industries table
CREATE TABLE IF NOT EXISTS industries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  icon text DEFAULT '',
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE industries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active industries"
  ON industries FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all industries"
  ON industries FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert industries"
  ON industries FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update industries"
  ON industries FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete industries"
  ON industries FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Materials table
CREATE TABLE IF NOT EXISTS materials (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  industry_id uuid REFERENCES industries(id) ON DELETE CASCADE,
  name text NOT NULL,
  material_code text UNIQUE NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL DEFAULT 0,
  unit text NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'ton', 'piece', 'liter', 'meter')),
  stock_quantity integer NOT NULL DEFAULT 0,
  min_order_quantity integer DEFAULT 1,
  attributes jsonb DEFAULT '{}'::jsonb,
  images text[] DEFAULT ARRAY[]::text[],
  is_featured boolean DEFAULT false,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active materials"
  ON materials FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Admins can view all materials"
  ON materials FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can insert materials"
  ON materials FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update materials"
  ON materials FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can delete materials"
  ON materials FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Buyer requests table
CREATE TABLE IF NOT EXISTS buyer_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id text UNIQUE NOT NULL,
  material_id uuid REFERENCES materials(id) ON DELETE CASCADE,
  buyer_name text NOT NULL,
  buyer_email text,
  buyer_mobile text,
  company_name text NOT NULL,
  requested_quantity decimal(10,2) NOT NULL,
  requested_unit text NOT NULL,
  additional_notes text DEFAULT '',
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewed', 'Confirmed', 'Dispatched', 'Completed', 'Cancelled')),
  admin_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT email_or_mobile_required CHECK (
    buyer_email IS NOT NULL OR buyer_mobile IS NOT NULL
  )
);

ALTER TABLE buyer_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create buyer requests"
  ON buyer_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view all buyer requests"
  ON buyer_requests FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update buyer requests"
  ON buyer_requests FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_materials_industry ON materials(industry_id);
CREATE INDEX IF NOT EXISTS idx_materials_active ON materials(is_active);
CREATE INDEX IF NOT EXISTS idx_materials_featured ON materials(is_featured);
CREATE INDEX IF NOT EXISTS idx_industries_active ON industries(is_active);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_status ON buyer_requests(status);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_material ON buyer_requests(material_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_industries_updated_at ON industries;
CREATE TRIGGER update_industries_updated_at BEFORE UPDATE ON industries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_materials_updated_at ON materials;
CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_buyer_requests_updated_at ON buyer_requests;
CREATE TRIGGER update_buyer_requests_updated_at BEFORE UPDATE ON buyer_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password: admin123, bcrypt hashed)
INSERT INTO users (name, email, password, role)
VALUES (
  'Admin',
  'admin@eco.com',
  '$2a$10$8YwPXs7tqDDZkI.hy9D4XO5p.W3lLrXMXHXWv2rh9WyHXQUoJUdZa',
  'admin'
)
ON CONFLICT (email) DO NOTHING;
