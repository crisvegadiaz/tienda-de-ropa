import { Router, type NextFunction, type Request, type Response } from "express";
import Modele from "../model.ts";

const productsRouter = Router()

productsRouter.get("/productos", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Modele.getAllProducts()
    res.json(products)
  } catch (err) {
    next(err);
  }
})

export default productsRouter