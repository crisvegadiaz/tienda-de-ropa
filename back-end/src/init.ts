import express from "express"
import productsRouter from "./router/products.route.ts"
import productVariantsRouter from "./router/productVariants.route.ts"

const app = express()
const port = 3000

app.disable("x-powered-by");

app.use(productsRouter)
app.use(productVariantsRouter)

// Middleware global de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(`[Error]: ${err.message}`);
    const status = err.status || 500;
    res.status(status).json({ error: err.message || "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
