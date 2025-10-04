import express from "express";
import bodyParser from "body-parser";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(bodyParser.json());

// API routes
app.use("/api/users", userRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//Always use bodyParser.json() if you want to read JSON in POST/PUT requests.

//app.use("/api/users", userRoutes) connects your routes to the main app.
