const express = require("express");
const Complaint = require("../models/complaint");
const router = express.Router();

// Fetch all complaints
router.get("/", async (req, res) => {
    try {
        const complaints = await Complaint.find();
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ error: "Error fetching complaints" });
    }
});

// Add a new complaint
router.post("/", async (req, res) => {
    try {
        const newComplaint = new Complaint({
            user: req.body.user,
            text: req.body.text
        });
        await newComplaint.save();
        res.status(201).json(newComplaint);
    } catch (error) {
        res.status(500).json({ error: "Error adding complaint" });
    }
});

// Delete a complaint
router.delete("/:id", async (req, res) => {
    try {
        await Complaint.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Complaint deleted" });
    } catch (error) {
        res.status(500).json({ error: "Error deleting complaint" });
    }
});

module.exports = router;
