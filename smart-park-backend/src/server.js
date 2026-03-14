require("dotenv").config();

const fs = require("fs");
const https = require("https");
const os = require("os");
const path = require("path");

const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const startReservationExpiryJob = require("./jobs/reservationExpiry.job");

const PORT = process.env.PORT || 5000;


/* ==============================
   Get Local Network IP
============================== */

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


/* ==============================
   Start Server
============================== */

const startServer = async () => {

    try {

        /* ==============================
           Connect MongoDB
        ============================== */

        await connectDB();

        console.log("✅ MongoDB Connected");


        /* ==============================
           Start Reservation Expiry Job
        ============================== */

        startReservationExpiryJob();

        console.log("⏱ Reservation expiry job started");


        /* ==============================
           SSL Certificate Paths
        ============================== */

        const certPath = path.join(__dirname, "../cert/cert.pem");
        const keyPath = path.join(__dirname, "../cert/key.pem");


        if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {

            console.error("❌ SSL certificate not found in /cert folder");

            process.exit(1);

        }


        const httpsOptions = {

            key: fs.readFileSync(keyPath),
            cert: fs.readFileSync(certPath)

        };


        /* ==============================
           Create HTTPS Server
        ============================== */

        const server = https.createServer(httpsOptions, app);


        /* ==============================
           Setup Socket.IO
        ============================== */

        const io = new Server(server, {

            cors: {
                origin: "*"
            }

        });


        app.set("io", io);


        io.on("connection", (socket) => {

            console.log("🔌 Client connected:", socket.id);

            socket.on("disconnect", () => {
                console.log("❌ Client disconnected:", socket.id);
            });

        });


        /* ==============================
           Start Server
        ============================== */

        server.listen(PORT, "0.0.0.0", () => {

            const localIP = getLocalIP();

            console.log("");
            console.log("🚀 HTTPS Server running on:");
            console.log(`   ➜ https://localhost:${PORT}`);
            console.log(`   ➜ https://${localIP}:${PORT}`);
            console.log("");
            console.log("📱 Mobile access URL:");
            console.log(`   https://${localIP}:${PORT}`);
            console.log("");
            console.log("⚠ If browser shows 'Not Secure', click 'Advanced → Proceed'");
            console.log("");

        });

    }

    catch (error) {

        console.error("❌ Server failed to start:", error.message);

        process.exit(1);

    }

};


/* ==============================
   Launch Server
============================== */

startServer();