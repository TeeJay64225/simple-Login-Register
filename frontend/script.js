const apiURL = "https://simple-login-register-r9pp.onrender.com"; // Correct backend URL

async function register() {
    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;

    const res = await fetch(`${apiURL}/register`, { // Ensure the correct route
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

    const res = await fetch(`${apiURL}/login`, { // Ensure the correct route
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "landing.html";
    } else {
        alert(data.error || "Login failed!");
    }
}
