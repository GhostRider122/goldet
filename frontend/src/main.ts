const API = "https://goldet-production.up.railway.app";

// Helper: get input value safely
function value(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el ? el.value.trim() : "";
}

// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = value("username");
    const password = value("password");
    const msg = document.getElementById("regMsg");

    if (!username || !password) {
      if (msg) msg.textContent = "Missing username or password.";
      return;
    }

    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (msg) msg.textContent = data.error || "Account created!";
    } catch (err) {
      if (msg) msg.textContent = "Server unreachable.";
    }
  });
}

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = value("username");
    const password = value("password");
    const msg = document.getElementById("loginMsg");

    if (!username || !password) {
      if (msg) msg.textContent = "Missing username or password.";
      return;
    }

    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (msg) msg.textContent = data.error || "Logged in!";
    } catch (err) {
      if (msg) msg.textContent = "Server unreachable.";
    }
  });
}
