const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const slotRoutes = require("./routes/slot.routes");
const sessionRoutes = require("./routes/session.routes");
const parkingLotRoutes = require("./routes/parkingLot.routes");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

/* ==============================
   Global Middlewares
============================== */

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

/* ==============================
   API Routes
============================== */

app.use("/api/auth", authRoutes);

app.use("/api/parking-lots", parkingLotRoutes);

app.use("/api/slots", slotRoutes);

app.use("/api/sessions", sessionRoutes);

app.use("/api/locations", locationRoutes);

/* ==============================
   Health Check Route
============================== */

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "SmartPark API Running"
    });
});

module.exports = app;