const express = require("express");
require("dotenv").config();
const cors = require("cors");
const connectToDatabase = require("./config/db");
const userRouter = require("./routes/user.routes");
const path = require("path");
const taskRouter = require("./routes/task.router");
const addressRouter = require("./routes/address.routes");
const appliedRoute = require("./routes/applied.routes");

const app = express();

// middlewares 

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use("/uploads", express.static("uploads"));

// routes
app.get("/",(req,res)=>{
    res.send("Hello World!");
});

// get images

app.get("/api/v1/images/:filename", (req, res) => {
    res.sendFile(path.join(__dirname, "uploads", req.params.filename));
});



app.use("/api/v1/users",userRouter);
app.use("/api/v1/tasks",taskRouter);
app.use("/api/v1/address",addressRouter);
app.use("/api/v1/apply",appliedRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
    connectToDatabase();
})