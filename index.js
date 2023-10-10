import express from "express";
import lessonRouter from "./routers/lesson.routes.js";
const PORT = process.env.PORT || 3003;

const app = express();
app.use(express.json());
app.use("/api", lessonRouter);

const server = app.listen(PORT, () =>
  console.log(`Server is running on port: ${PORT}`),
);
export default server;
