import { Router, type NextFunction, type Request, type Response } from "express";
import Modele from "../model.ts";
import { validateId } from "../middleware/validate.middleware.ts";

const productVariantsRouter = Router()

productVariantsRouter.get("/producto/:id/variantes", validateId, async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
	try {
		const product = await Modele.getProductVariants(req.params.id)
		res.json(product)
	} catch (err) {
		next(err);
	}
})

export default productVariantsRouter