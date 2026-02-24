require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./src/models/User");

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI);
};

const createAdmin = async () => {
    try {
        await connectDB();

        const existing = await User.findOne({ email: "admin@smartpark.com" });
        if (existing) {
            console.log("Admin already exists");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            name: "Admin User",
            email: "admin@smartpark.com",
            password: hashedPassword,
            role: "admin",
        });

        console.log("Admin created successfully");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();