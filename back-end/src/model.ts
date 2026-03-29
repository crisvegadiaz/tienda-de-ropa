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
  nombre: string;
  precio: string;
}

export interface ProductoVariante {
  talle: string;
  color: string;
}

class Modelo {
  /**
   * Obtiene todos los productos.
   * @returns {Promise<Producto[]>} Respuesta con la lista de productos.
   */
  static async getAllProducts(): Promise<Producto[]> {
    try {
      const { rows } = await pool.query<Producto>("select id, nombre, precio from productos");
      return rows;
    } catch (error) {
      throw error;
    }
  }

  /**
    * Obtiene las variantes de un producto específico por su ID.
    * @param {string} id - El ID del producto.
    * @returns {Promise<ProductoVariante[]>} Respuesta con la lista de variantes del producto. 
  */

  static async getProductVariants(id: string): Promise<ProductoVariante[]> {
    try {
      // Usamos el genérico <ProductoVariante> para asegurar el tipo de retorno
      const { rows } = await pool.query<ProductoVariante>(`
      select
        v.talle,
        v.color
      from
        productos p
        join variantes_producto v ON p.id = v.producto_id
      where p.id = $1
      `, [id])
      return rows
    } catch (error) {
      throw error;
    }
  }
}

export default Modelo
