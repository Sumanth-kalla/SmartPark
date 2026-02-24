const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const slotRoutes = require("./routes/slot.routes");
const authRoutes = require("./routes/auth.routes");
const parkingLotRoutes = require("./routes/parkingLot.routes");
const sessionRoutes = require("./routes/session.routes");


const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use("/api/parking-lots", parkingLotRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/sessions", sessionRoutes);

module.exports = app;