const express = require("express");
const mongoose = require("mongoose");
const calendarRoutes = require("./routes/uploadCalendar");

const app = express();
const PORT = 3000;

app.use(express.json());

// app.use("/api", calendarRoutes);
mongoose
  .connect("mongodb://localhost:27017/admin", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));
