import * as pg from "pg";

// Instancia única del Pool (Singleton)
const pool = new pg.Pool({
  host: process.env.DB_HOST ?? "localhost",
  user: process.env.DB_USER,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  max: 5,
  idleTimeoutMillis: 30000,
});

// Verificación de errores en la conexión a la base de datos
pool.on("error", (err, _) => {
  console.error("Unexpected database connection failure: ", err);
});

// Verificación de conexión inicial (correctamente liberada)
pool.connect().then((client) => {
  console.log("Database connection successful");
  client.release();
}).catch((err) => {
  console.error("Could not connect to database: ", err);
});

export interface Producto {
  id?: string;
  nombre: string;
  precio: string;
  genero?: string;
}

export interface ProductoVariante {
  talle: string;
  color: string;
  cantidad: number;
}

class Modelo {
  /**
   * Obtiene todos los productos.
   * @returns {Promise<Producto[]>} Respuesta con la lista de productos.
   */
  static async getAllProducts(): Promise<Producto[]> {
    const { rows } = await pool.query<Producto>("select id, nombre, precio from productos");
    return rows;
  }

  /**
    * Obtiene las variantes de un producto específico por su ID.
    * @param {string} id - El ID del producto.
    * @returns {Promise<ProductoVariante[]>} Respuesta con la lista de variantes del producto. 
  */

  static async getProductVariants(id: string): Promise<ProductoVariante[]> {
    const { rows } = await pool.query<ProductoVariante>(`
      select
        v.talle,
        v.color,
        v.stock_cantidad as cantidad
      from
        productos p
        join variantes_producto v ON p.id = v.producto_id
      where p.id = $1
      `, [id])
    return rows
  }

  /** 
   * Obtiene un producto específico por su ID, incluyendo su nombre, precio y género.
   * @param {string} id - El ID del producto.
   * @returns {Promise<Producto | null>} Respuesta con el producto encontrado o null si no existe.
  */

  static async getProduct(id: string): Promise<Producto | null> {
    const { rows } = await pool.query<Producto>(`
    select
        p.nombre,
        p.precio,
        c.nombre as genero
    from
        productos p
    join categorias c ON p.categoria_id = c.id
    where p.id = $1`, [id]);
    return rows[0] ?? null;
  }
}

export default Modelo
