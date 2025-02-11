const apiURL = "https://simple-login-register-r9pp.onrender.com:10000"; // Ensure correct backend URL"; // Correct backend URL

async function register() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${apiURL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    alert(data.message || "Registration successful!");
}

async function login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const res = await fetch(`${apiURL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok) { // Checks if the response status is in the 200-299 range
            localStorage.setItem("token", data.token); // Save token
            alert("Login successful!");
            window.location.href = "landing.html"; // Redirect after successful login
        } else {
            alert(data.message || "Login failed!"); // Show error message if login fails
        }
    } catch (error) {
        console.error("❌ Error during login:", error);
        alert("Something went wrong. Please try again later.");
    }
}

