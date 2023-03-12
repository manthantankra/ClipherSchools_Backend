const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./routes/users.js");
const videoRoutes = require("./routes/videos.js");
const commentRoutes = require("./routes/comments.js");
const authRoutes = require("./routes/auth.js");
const cookieParser = require("cookie-parser");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 4000;

// db connections
const connect = () => {
    mongoose.connect(process.env.MONGODB_URL, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
        .then(() => {
            console.log("DB GOT CONNECTED");
        })
        .catch((err) => {
            console.log("DB NOT CONNECTED", err.message);;
        });
};

//middlewares
app.use(cookieParser())
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);

//error handler
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

app.listen(PORT, () => {
    connect();
    console.log(`Server is running on port ${PORT}`);
});