import express from "express";
import { engine } from "express-handlebars";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { env } from "./config/env.config.js";
import {
  errorHandler,
  notFoundHandler
} from "./middlewares/error.middleware.js";
import { bookingRouter } from "./routes/booking.router.js";
import { serviceRouter } from "./routes/service.router.js";
import { viewRouter } from "./routes/view.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine(
  "handlebars",
  engine({
    helpers: {
      currency(value) {
        const number = Number(value ?? 0);
        return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          maximumFractionDigits: 2
        }).format(number);
      },
      dateTime(value) {
        if (!value) return "-";
        return new Intl.DateTimeFormat("es-AR", {
          dateStyle: "medium",
          timeStyle: "short"
        }).format(new Date(value));
      }
    }
  })
);
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.get("/health", (_req, res) => {
  res.json({
    status: "success",
    app: env.APP_NAME,
    environment: env.APP_ENV,
    timestamp: new Date().toISOString()
  });
});

app.use("/api/services", serviceRouter);
app.use("/api/bookings", bookingRouter);
app.use("/", viewRouter);

app.use(notFoundHandler);
app.use(errorHandler);
