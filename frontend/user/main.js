document.addEventListener("DOMContentLoaded", () => {
    greetUser();
});

function greetUser() {
    appendMessage("bot", "👋 Hi, this is Cop Bot, your Legal Assistant. Here, you can file complaints.");
    fetchComplaintCategories();
}

// Fetch complaint categories from the backend
function fetchComplaintCategories() {
    fetch("http://localhost:5000/api/get-categories")
        .then(response => response.json())
        .then(data => {
            let message = "📌 Please select a complaint category:<br><br>";
            data.forEach((cat, index) => {
                message += `${index + 1}. ${cat}<br>`;
            });
            appendMessage("bot", message);
        })
        .catch(error => console.error("Error fetching complaint categories:", error));
}

// Handle user input
function sendMessage() {
    let inputField = document.getElementById("userInput");
    let userMessage = inputField.value.trim();
    if (!userMessage) return;

    appendMessage("user", userMessage);
    inputField.value = "";

    selectCategory(userMessage);
}

// Handle category selection
function selectCategory(userMessage) {
    fetch("http://localhost:5000/api/get-categories")
        .then(response => response.json())
        .then(categories => {
            let selectedIndex = parseInt(userMessage) - 1;
            if (selectedIndex >= 0 && selectedIndex < categories.length) {
                let selectedCategory = categories[selectedIndex];
                appendMessage("bot", `✅ You selected <b>${selectedCategory}</b>. Please describe your complaint.`);
                listenForComplaint(selectedCategory);
            } else {
                appendMessage("bot", "❌ Invalid selection. Please enter a valid number.");
            }
        })
        .catch(error => console.error("Error fetching categories:", error));
}

// Handle complaint filing
function listenForComplaint(category) {
    let inputField = document.getElementById("userInput");
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            let complaintDescription = inputField.value.trim();
            if (!complaintDescription) return;

            appendMessage("user", complaintDescription);
            fileComplaint(category, complaintDescription);
        }
    });
}

// Send complaint to the backend
function fileComplaint(category, description) {
    fetch("http://localhost:5000/api/file-complaint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description })
    })
    .then(response => response.json())
    .then(data => appendMessage("bot", "✅ Your complaint has been filed successfully."))
    .catch(error => console.error("Error filing complaint:", error));
}

// Append messages to chat
function appendMessage(sender, message) {
    let chatBox = document.getElementById("chatBox");
    let messageDiv = document.createElement("div");
    messageDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
    messageDiv.innerHTML = message;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}
