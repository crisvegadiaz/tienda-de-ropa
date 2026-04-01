import { Router, type NextFunction, type Request, type Response } from "express";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validateId } from "../middleware/validate.middleware.ts";

const imageRouter = Router();
const __dirname = dirname(fileURLToPath(import.meta.url));
const publicPath = join(__dirname, "../../public");

imageRouter.get("/producto/img/:id", validateId, (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
  const imagePath = join(publicPath, `${req.params.id}.png`);

  res.sendFile(imagePath, (err) => {
    if (err) {
      res.status(404).json({ error: "Imagen no encontrada" });
    }
  });
});

export default imageRouter