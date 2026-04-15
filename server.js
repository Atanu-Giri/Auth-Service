import "dotenv/config";

import express from "express";
import passport from "passport";
import mongoose from "mongoose";

import "./config/passport.js";
import authRoutes from "./routes/auth.js";


const app = express();
app.use(express.json());
app.use(passport.initialize());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API running...");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});