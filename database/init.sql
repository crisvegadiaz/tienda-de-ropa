-- Asegurar que la extensión para UUID esté activa
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE
  IF NOT EXISTS categorias (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE -- Añadí UNIQUE para evitar "Masculino" duplicado
  );

CREATE TABLE
  IF NOT EXISTS productos (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL CHECK (precio > 0),
    categoria_id INTEGER REFERENCES categorias (id),
    fecha_creacion TIMESTAMP
    WITH
      TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Recomendado usar Time Zone
  );

-- Índice para búsquedas rápidas por categoría
CREATE INDEX IF NOT EXISTS idx_productos_categoria_id ON productos (categoria_id);

CREATE TABLE
  IF NOT EXISTS variantes_producto (
    id UUID DEFAULT gen_random_uuid () PRIMARY KEY,
    producto_id UUID REFERENCES productos (id) ON DELETE CASCADE,
    talle VARCHAR(10) NOT NULL CHECK (
      talle IN (
        'XS',
        'S',
        'M',
        'L',
        'XL',
        'XXL',
        '3XL',
        '34',
        '36',
        '38',
        '40',
        '42',
        '44',
        '46',
        '48',
        '50',
        '52',
        '54',
        '56',
        '58',
        '60'
      )
    ),
    color VARCHAR(30),
    stock_cantidad INT NOT NULL DEFAULT 0 CHECK (stock_cantidad >= 0),
    sku VARCHAR(50) UNIQUE
  );

-- 1. Insertar Categorías
INSERT INTO
  categorias (nombre)
VALUES
  ('Masculino'),
  ('Femenino'),
  ('Unisex') ON CONFLICT (nombre) DO NOTHING;

-- 2. Insertar Productos
-- Usamos una subconsulta para obtener el ID de la categoría de forma dinámica
INSERT INTO
  productos (nombre, descripcion, precio, categoria_id)
VALUES
  (
    'Jean Slim Fit Classic',
    'Pantalón de jean azul prelavado, corte ajustado.',
    4500.00,
    (
      SELECT
        id
      FROM
        categorias
      WHERE
        nombre = 'Masculino'
    )
  ),
  (
    'Remera Oversize Algodón',
    'Remera de algodón 100% premium, ideal para verano.',
    2200.00,
    (
      SELECT
        id
      FROM
        categorias
      WHERE
        nombre = 'Femenino'
    )
  ),
  (
    'Camisa Oxford Blanca',
    'Camisa formal de alta calidad, cuello reforzado.',
    5800.00,
    (
      SELECT
        id
      FROM
        categorias
      WHERE
        nombre = 'Masculino'
    )
  ),
  (
    'Vestido Midi Floral',
    'Vestido ligero con estampado de flores, corte a la cintura.',
    7500.00,
    (
      SELECT
        id
      FROM
        categorias
      WHERE
        nombre = 'Femenino'
    )
  );

-- 3. Insertar Variantes (Talles, Precios y Stock)
-- Nota: Como los IDs de productos son UUIDs, lo más práctico es hacer un JOIN 
-- para insertarlos basándonos en el nombre del producto.
INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  '42',
  'Azul',
  15,
  'JEAN-BLU-42'
FROM
  productos
WHERE
  nombre = 'Jean Slim Fit Classic';

INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  '44',
  'Azul',
  10,
  'JEAN-BLU-44'
FROM
  productos
WHERE
  nombre = 'Jean Slim Fit Classic';

INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  'S',
  'Blanco',
  25,
  'REM-OV-S'
FROM
  productos
WHERE
  nombre = 'Remera Oversize Algodón';

INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  'M',
  'Blanco',
  30,
  'REM-OV-M'
FROM
  productos
WHERE
  nombre = 'Remera Oversize Algodón';

INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  'L',
  'Blanco',
  5,
  'REM-OV-L'
FROM
  productos
WHERE
  nombre = 'Remera Oversize Algodón';

INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  'M',
  'Blanco',
  12,
  'CAM-OXF-M'
FROM
  productos
WHERE
  nombre = 'Camisa Oxford Blanca';

INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  'XL',
  'Blanco',
  8,
  'CAM-OXF-XL'
FROM
  productos
WHERE
  nombre = 'Camisa Oxford Blanca';

INSERT INTO
  variantes_producto (producto_id, talle, color, stock_cantidad, sku)
SELECT
  id,
  'S',
  'Estampado',
  20,
  'VES-FLO-S'
FROM
  productos
WHERE
  nombre = 'Vestido Midi Floral';

/* Consulta para obtener el catálogo de productos */
/* SELECT
  p.nombre AS producto,
  c.nombre AS genero,
  p.precio,
  v.talle,
  v.color,
  v.stock_cantidad AS stock,
  v.sku
FROM
  productos p
  JOIN categorias c ON p.categoria_id = c.id
  JOIN variantes_producto v ON p.id = v.producto_id
ORDER BY */
  p.nombre,
  v.talle;

/* Consulta para obtener productos masculinos */
/* SELECT
  p.nombre,
  p.precio,
  c.nombre AS genero
FROM
  productos p
  JOIN categorias c ON p.categoria_id = c.id
WHERE */
  c.nombre = 'Masculino';

/* Consulta para obtener productos masculinos en talle S */
/* SELECT
  p.nombre,
  p.precio,
  c.nombre AS genero,
  v.talle
FROM
  productos p
  JOIN categorias c ON p.categoria_id = c.id
  JOIN variantes_producto v ON p.id = v.producto_id
WHERE */
  c.nombre = 'Masculino'
  and v.talle = 'S';