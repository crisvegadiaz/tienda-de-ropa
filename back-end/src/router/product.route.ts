import { Router, type NextFunction, type Request, type Response } from "express";
import { validateId } from "../middleware/validate.middleware.ts";
import Modele from "../model.ts";

const productRouter = Router()

productRouter.get("/producto/:id", validateId, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  try {
    const products = await Modele.getProduct(req.params.id)
    res.json(products)
  } catch (err) {
    next(err);
  }
})

export default productRouter