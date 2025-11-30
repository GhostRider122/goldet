const API = "http://localhost:3000";  // ← change to your backend URL

// REGISTER
const regForm = document.getElementById("registerForm") as HTMLFormElement | null;
if (regForm) {
  regForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const usernameEl = document.getElementById("regUser") as HTMLInputElement;
    const passwordEl = document.getElementById("regPass") as HTMLInputElement;
    const msgEl = document.getElementById("regMsg");

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();

    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    msgEl!.textContent = data.error || "Account created!";
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameEl = document.getElementById("loginUser") as HTMLInputElement;
    const passwordEl = document.getElementById("loginPass") as HTMLInputElement;
    const msgEl = document.getElementById("loginMsg");

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();

    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    msgEl!.textContent = data.error || "Logged in!";
  });
}
