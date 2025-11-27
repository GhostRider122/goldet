// main.ts
// Handles login, register, auth state, and page protection

interface User {
    username: string;
    password: string;
    golds: any[];
    stats: {
        packsOpened: number;
        goldsCollected: number;
    };
}

// ===========================
// STORAGE HELPERS
// ===========================

const saveUsers = (users: User[]) => {
    localStorage.setItem("users", JSON.stringify(users));
};

const loadUsers = (): User[] => {
    return JSON.parse(localStorage.getItem("users") || "[]");
};

const setCurrentUser = (username: string) => {
    localStorage.setItem("currentUser", username);
};

const getCurrentUser = (): User | null => {
    const username = localStorage.getItem("currentUser");
    if (!username) return null;

    const users = loadUsers();
    return users.find(u => u.username === username) || null;
};

const updateUser = (updatedUser: User) => {
    const users = loadUsers();
    const index = users.findIndex(u => u.username === updatedUser.username);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
    }
};

// ===========================
// LOGIN SYSTEM
// ===========================

export const registerUser = (username: string, password: string) => {
    const users = loadUsers();

    if (users.some(u => u.username === username)) {
        return { success: false, message: "Username already exists." };
    }

    const newUser: User = {
        username,
        password,
        golds: [],
        stats: {
            packsOpened: 0,
            goldsCollected: 0
        }
    };

    users.push(newUser);
    saveUsers(users);

    return { success: true };
};

export const loginUser = (username: string, password: string) => {
    const users = loadUsers();

    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        return { success: false, message: "Invalid username or password." };
    }

    setCurrentUser(user.username);
    return { success: true };
};

export const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "login.html";
};

// ===========================
// PAGE PROTECTION
// ===========================

export const protectPage = () => {
    const publicPages = ["login.html", "register.html"];

    const page = window.location.pathname.split("/").pop();

    const user = getCurrentUser();

    if (!user && !publicPages.includes(page || "")) {
        window.location.href = "login.html";
    }

    if (user && publicPages.includes(page || "")) {
        window.location.href = "index.html";
    }
};

// Call automatically on page load
protectPage();

// ===========================
// FORM HOOKS
// ===========================

document.addEventListener("DOMContentLoaded", () => {
    // REGISTER
    const registerBtn = document.getElementById("register-btn");
    if (registerBtn) {
        registerBtn.addEventListener("click", () => {
            const username = (document.getElementById("username") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;

            const result = registerUser(username, password);

            if (!result.success) {
                alert(result.message);
                return;
            }

            alert("Account created! Please log in.");
            window.location.href = "login.html";
        });
    }

    // LOGIN
    const loginBtn = document.getElementById("login-btn");
    if (loginBtn) {
        loginBtn.addEventListener("click", () => {
            const username = (document.getElementById("username") as HTMLInputElement).value;
            const password = (document.getElementById("password") as HTMLInputElement).value;

            const result = loginUser(username, password);

            if (!result.success) {
                alert(result.message);
                return;
            }

            window.location.href = "index.html";
        });
    }
});
