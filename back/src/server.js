import authRoutes from "./routes/auth.routes.js";
import adminPlansRoutes from "./routes/admin/plans.routes.js";
import adminEstablishmentsRoutes from "./routes/admin/establishments.routes.js";
import employeesRoutes from "./routes/owner/employees.routes.js";
import productsRoutes from "./routes/owner/products.routes.js";
import recipesRoutes from "./routes/owner/recipes.routes.js";
import purchasesRoutes from "./routes/owner/purchases.routes.js";
import alertsRoutes from "./routes/owner/alerts.routes.js";
import adminLogsRoutes from "./routes/admin/logs.routes.js";
import ownerSummaryRoutes from "./routes/owner/summary.routes.js";


import express from "express";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/admin/plans", adminPlansRoutes);
app.use("/admin/establishments", adminEstablishmentsRoutes);
app.use("/owner/employees", employeesRoutes);
app.use("/owner/products", productsRoutes);
app.use("/owner/recipes", recipesRoutes);
app.use("/owner/purchases", purchasesRoutes);
app.use("/owner/alerts", alertsRoutes);
app.use("/admin/logs", adminLogsRoutes);
app.use("/owner", ownerSummaryRoutes);

app.get("/", (req, res) => {
  res.send("API rodando 🚀");
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
