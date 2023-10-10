import Router from "express";
import lessonController from "../controllers/lessonController.js";

const router = new Router();

router.get("/", lessonController.getAllLessons);
router.post("/lessons", lessonController.createLessons);

export default router;
