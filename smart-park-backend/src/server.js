require("dotenv").config();
const fs = require("fs");
const https = require("https");
const os = require("os");
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

// Helper to get local network IP dynamically
const getLocalIP = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name]) {
            if (net.family === "IPv4" && !net.internal) {
                return net.address;
            }
        }
    }
    return "localhost";
};

const startServer = async () => {
    try {
        await connectDB();
        console.log("✅ MongoDB Connected");

        const options = {
            key: fs.readFileSync("./cert/key.pem"),
            cert: fs.readFileSync("./cert/cert.pem"),
        };

        const server = https.createServer(options, app);

        server.listen(PORT, "0.0.0.0", () => {
            const localIP = getLocalIP();

            console.log("🚀 HTTPS Server running on:");
            console.log(`   ➜ https://localhost:${PORT}`);
            console.log(`   ➜ https://${localIP}:${PORT}`);
        });

    } catch (error) {
        console.error("❌ Server failed to start:", error.message);
        process.exit(1);
    }
};

startServer();