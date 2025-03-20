const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const complaintRoutes = require("./routes/complaintRoutes");
const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/complaints"; // Change 'myDatabase' as needed

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = mongoose;


dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());


// API Routes
app.use("/api", complaintRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});