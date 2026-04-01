import { type Request, type Response, type NextFunction } from "express";
import Joi from "joi";

const uuidSchema = Joi.string().uuid({ version: "uuidv4" }).required();

export const validateId = (req: Request, res: Response, next: NextFunction) => {
  const { error } = uuidSchema.validate(req.params.id);
  if (error) {
    return res.status(400).json({ error: "Formato de UUID inválido o ausente" });
  }
  next();
};
