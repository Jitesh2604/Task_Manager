const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require('dotenv').config();
const userRoutes = require("./routes/user.routes");
const taskRoutes = require("./routes/task.routes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async() => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log("Server Connection Failed!")
        
    }
});