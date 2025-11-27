/* compiled JS of main.ts - paste into frontend/dist/main.js */
"use strict";
// helper & API
const API = "http://localhost:3000";
async function postJson(url, data) {
    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        return await r.json();
    }
    catch (e) {
        return { error: "Server unreachable" };
    }
}
async function getJson(url) {
    try {
        const r = await fetch(url);
        return await r.json();
    }
    catch (e) {
        return { error: "Server unreachable" };
    }
}
// session helpers
function setSession(user) { localStorage.setItem("goldet_user", user); updateTopCoins(); }
function getSession() { return localStorage.getItem("goldet_user"); }
function clearSession() { localStorage.removeItem("goldet_user"); updateTopCoins(); }
// UI
async function updateTopCoins() {
    const u = getSession();
    const els = document.querySelectorAll("#topCoins");
    let text = "Coins: 0";
    if (u) {
        const data = await getJson(`${API}/user/${u}`);
        if (!data.error)
            text = `Coins: ${data.coins}`;
    }
    els.forEach(e => (e.textContent = text));
}
// REGISTER
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("regUser").value.trim();
        const password = document.getElementById("regPass").value.trim();
        const msg = document.getElementById("regMsg");
        msg.textContent = "Processing...";
        const res = await postJson(`${API}/auth/register`, { username, password });
        if (res.error) {
            msg.textContent = res.error;
            msg.style.color = "tomato";
        }
        else {
            msg.textContent = "Account created! Logging in...";
            setSession(username);
            setTimeout(() => { location.href = "index.html"; }, 800);
        }
        updateTopCoins();
    });
}
// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("loginUser").value.trim();
        const password = document.getElementById("loginPass").value.trim();
        const msg = document.getElementById("loginMsg");
        msg.textContent = "Checking...";
        const res = await postJson(`${API}/auth/login`, { username, password });
        if (res.error) {
            msg.textContent = res.error;
            msg.style.color = "tomato";
        }
        else {
            msg.textContent = "Welcome!";
            setSession(res.user.username);
            setTimeout(() => { location.href = "index.html"; }, 600);
        }
        updateTopCoins();
    });
}
// Logout
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn)
    logoutBtn.addEventListener("click", () => { clearSession(); location.href = "index.html"; });
// Stats view
const viewBtn = document.getElementById("viewBtn");
if (viewBtn) {
    viewBtn.addEventListener("click", async () => {
        const target = document.getElementById("viewUser").value.trim() || getSession();
        if (!target)
            return alert("Enter a username");
        const data = await getJson(`${API}/user/${target}`);
        if (data.error)
            return alert(data.error);
        document.getElementById("profileName").textContent = data.username;
        document.getElementById("statIcons").textContent = (data.stats?.icons || 0).toString();
        document.getElementById("statCoins").textContent = (data.coins || 0).toString();
    });
}
// load collection
async function loadCollection() {
    const u = getSession();
    const grid = document.getElementById("collectionGrid");
    const no = document.getElementById("noGolds");
    if (!grid || !no)
        return;
    if (!u) {
        grid.innerHTML = "";
        no.textContent = "Log in to see your Golds.";
        return;
    }
    const data = await getJson(`${API}/user/${u}`);
    if (data.error) {
        grid.innerHTML = "";
        no.textContent = data.error;
        return;
    }
    const golds = data.golds || [];
    if (!golds.length) {
        grid.innerHTML = "";
        no.style.display = "block";
        return;
    }
    no.style.display = "none";
    grid.innerHTML = golds.map((g) => `<div class="card center"><div style="font-size:48px">${g.icon || '😀'}</div><div style="font-weight:700;margin-top:8px">${g.name}</div><div class="small-muted">${g.rarity}</div></div>`).join("");
}
// animation overlay elements
const overlay = document.getElementById("packOverlay");
const packEgg = document.getElementById("packEgg");
const goldFace = document.getElementById("goldFace");
document.addEventListener("click", (ev) => {
    const t = ev.target;
    if (t && t.classList && t.classList.contains("open-pack")) {
        const pack = t.getAttribute("data-pack");
        openPack(pack || "emoji");
    }
});
async function openPack(packId) {
    if (!overlay || !packEgg || !goldFace)
        return;
    overlay.classList.remove("hidden");
    overlay.style.pointerEvents = "auto";
    const emoji = packId === "emoji" ? "🥚" : packId === "color" ? "🥚" : "🥚";
    packEgg.textContent = emoji;
    goldFace.style.transform = "scale(0)";
    goldFace.style.opacity = "0";
    packEgg.animate([
        { transform: "translateY(0) rotate(0deg)" },
        { transform: "translateY(-6px) rotate(-6deg)" },
        { transform: "translateY(6px) rotate(6deg)" },
        { transform: "translateY(0) rotate(0deg)" }
    ], { duration: 700, iterations: 6 });
    await new Promise(r => setTimeout(r, 900));
    const chosen = pickGold(packId);
    goldFace.textContent = chosen.icon;
    goldFace.style.transition = "transform .45s cubic-bezier(.22,.9,.3,1),opacity .25s";
    goldFace.style.transform = "scale(1)";
    goldFace.style.opacity = "1";
    const user = getSession();
    if (user) {
        await postJson(`${API}/user/${user}/addGold`, {
            id: `${packId}-${Date.now()}`,
            name: chosen.name,
            rarity: chosen.rarity,
            icon: chosen.icon
        });
        setTimeout(() => { loadCollection(); updateTopCoins(); }, 200);
    }
    setTimeout(() => { overlay.classList.add("hidden"); overlay.style.pointerEvents = "none"; }, 1600);
}
function pickGold(packId) {
    const pools = {
        emoji: [
            { id: "confused", name: "Confused Emoji", rarity: "Common", icon: "🤨" },
            { id: "party", name: "Party Emoji", rarity: "Rare", icon: "🥳" },
            { id: "poop", name: "Poop Emoji", rarity: "Common", icon: "💩" }
        ],
        color: [
            { id: "rainbow", name: "Color Egg", rarity: "Rare", icon: "🌈" },
            { id: "blue", name: "Blue Egg", rarity: "Common", icon: "🔵" }
        ],
        pixel: [
            { id: "chicken", name: "Pixel Chicken", rarity: "Common", icon: "🐔" }
        ]
    };
    const pool = pools[packId] || pools.emoji;
    const idx = Math.floor(Math.random() * pool.length);
    return pool[idx];
}
document.addEventListener("DOMContentLoaded", () => {
    updateTopCoins();
    loadCollection();
    const pName = document.getElementById("profileName");
    if (pName) {
        const u = getSession();
        if (u) {
            document.getElementById("profileName").textContent = u;
            getJson(`${API}/user/${u}`).then(d => {
                if (!d.error) {
                    document.getElementById("statIcons").textContent = (d.stats?.icons || 0).toString();
                    document.getElementById("statCoins").textContent = (d.coins || 0).toString();
                }
            });
        }
    }
    const su = document.getElementById("settingsUser");
    if (su)
        su.textContent = getSession() || "Not logged in";
});
