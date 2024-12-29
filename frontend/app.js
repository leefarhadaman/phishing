document.getElementById("phishingLink").addEventListener("click", function(event) {
    event.preventDefault();
    alert("You clicked the phishing link! Be careful next time.");
    
    fetch("http://localhost:3000/track-click", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ clicked: true })
    });
});

document.getElementById("learnButton").addEventListener("click", function() {
    alert("Phishing emails often contain fake links or urgent requests. Always check the email source and look for signs of inconsistency.");
});

// Send phishing emails
document.getElementById("sendEmails").addEventListener("click", function() {
    const numEmails = document.getElementById("numEmails").value;
    fetch("http://localhost:3000/send-email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ number: numEmails })
    }).then(response => response.json())
      .then(data => alert(data))
      .catch(error => console.error("Error sending emails:", error));
});

// Send phishing SMS
document.getElementById("sendSMS").addEventListener("click", function() {
    const smsNumbers = document.getElementById("smsNumbers").value.split(",");
    const numSMS = document.getElementById("numSMS").value;
    fetch("http://localhost:3000/send-sms", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ number: numSMS, numbers: smsNumbers })
    }).then(response => response.json())
      .then(data => alert(data))
      .catch(error => console.error("Error sending SMS:", error));
});
