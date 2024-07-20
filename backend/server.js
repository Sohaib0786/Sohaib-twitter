import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";
import fs from "fs";
dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;
//const __dirname = path.resolve();

app.use(express.json({ limit:"5mb" })); // to parse req.body
// limit shouldn't be too high to prevent DOS
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);




app.post('/api/users/update', async (req, res) => {
    try {
        // Access the files from req.body or req.files depending on the setup
        const { coverImg, profileImg, ...otherData } = req.body;

        // Handle files (base64 encoded images) or form data (multipart)
        // Example: Save files to disk or process as needed
        // Example: For base64 encoded images
        if (coverImg) {
            const coverImgBuffer = Buffer.from(coverImg.replace('/^data:image/\w+;base64,/, '), 'base64');
            fs.writeFileSync('path/to/save/coverImg.jpg', coverImgBuffer);
        }

        if (profileImg) {
            const profileImgBuffer = Buffer.from(profileImg.replace('/^data:image/\w+;base64,/, '), 'base64');
            fs.writeFileSync('path/to/save/profileImg.jpg', profileImgBuffer);
        }

        // Handle other data and respond accordingly
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


/*
if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend/dist")));

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
	});
}

*/


app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
	connectMongoDB();
});