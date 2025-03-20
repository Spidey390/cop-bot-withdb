const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
    user: String,
    text: String,
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
