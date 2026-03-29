import { Router, type NextFunction, type Request, type Response } from "express";
import Modele from "../model.ts";
import Joi from "joi";

const productVariantsRouter = Router()

productVariantsRouter.get("/producto/:id/variantes", async (req: Request, res: Response, next: NextFunction) => {
	let { id } = req.params;

	const schema = Joi.string().uuid({ version: "uuidv4" }).required();
	const { error, value } = schema.validate(id);

	if (error) {
		return res.status(400).json({ error: "Invalid or missing product UUID" });
	}

	try {
		const product = await Modele.getProductVariants(value)
		res.json(product)
	} catch (err) {
		next(err);
	}
})

export default productVariantsRouter