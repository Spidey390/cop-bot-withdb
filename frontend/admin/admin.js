document.addEventListener("DOMContentLoaded", function () {
    const complaintList = document.getElementById("complaintList");
    const complaintForm = document.getElementById("complaintForm");
    const userNameInput = document.getElementById("userName");
    const complaintTextInput = document.getElementById("complaintText");

    // Fetch complaints from MongoDB
    async function fetchComplaints() {
        try {
            const response = await fetch("http://localhost:5000/api/complaints");
            const complaints = await response.json();
            renderComplaints(complaints);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    }

    // Render complaints in the list
    function renderComplaints(complaints) {
        complaintList.innerHTML = "";
        complaints.forEach(complaint => {
            const li = document.createElement("li");
            li.classList.add("complaint-item");
            li.innerHTML = `
                <span><strong>${complaint.user}</strong>: ${complaint.text}</span>
                <button onclick="deleteComplaint('${complaint._id}')">Delete</button>
            `;
            complaintList.appendChild(li);
        });
    }

    // Add new complaint
    complaintForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        const newComplaint = {
            user: userNameInput.value,
            text: complaintTextInput.value
        };

        try {
            const response = await fetch("http://localhost:5000/api/complaints", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newComplaint)
            });

            if (response.ok) {
                fetchComplaints();
                complaintForm.reset();
            } else {
                console.error("Failed to add complaint");
            }
        } catch (error) {
            console.error("Error adding complaint:", error);
        }
    });

    // Delete complaint
    async function deleteComplaint(complaintId) {
        try {
            const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchComplaints();
            } else {
                console.error("Failed to delete complaint");
            }
        } catch (error) {
            console.error("Error deleting complaint:", error);
        }
    }

    // Initial fetch
    fetchComplaints();
});
