import { Router } from "express";
import bcrypt from "bcryptjs";
import { readDB, writeDB } from "../utils/readWrite.js";
const router = Router();
// Register
router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "Missing username/password" });
    const db = await readDB();
    if (db[username])
        return res.status(400).json({ error: "User exists" });
    const hash = bcrypt.hashSync(password, 10);
    db[username] = {
        password: hash,
        coins: 1000,
        stats: { icons: 0, level: 1 },
        golds: []
    };
    await writeDB(db);
    return res.json({ success: true, username });
});
// Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ error: "Missing username/password" });
    const db = await readDB();
    const user = db[username];
    if (!user)
        return res.status(400).json({ error: "User not found" });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok)
        return res.status(401).json({ error: "Invalid credentials" });
    // Return safe user data (no password)
    const safe = { username, coins: user.coins, stats: user.stats, golds: user.golds || [] };
    return res.json({ success: true, user: safe });
});
export default router;
