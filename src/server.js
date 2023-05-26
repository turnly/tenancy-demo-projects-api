import express from "express";
import morgan from "morgan";

import projects from "./projects.js";
import { auth } from "./middleware.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use(auth);
app.use("/api", projects);

app.listen(4000);

console.log("Server on port", 4000);
