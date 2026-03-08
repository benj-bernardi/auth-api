import express from "express";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const app = express();

app.use(express.json());
app.use("/users", userRoutes);
app.use("/admin", adminRoutes);
app.use(errorHandler);

export default app;