require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        console.log("✅ MongoDB Connected");

        // Start server
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🚀 Server running on:`);
            console.log(`   ➜ http://localhost:${PORT}`);
            console.log(`   ➜ http://192.168.0.13:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1);
    }
};

startServer();