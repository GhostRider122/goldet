import { Router } from "express";
import { readDB, writeDB } from "../utils/readWrite.js";
const router = Router();
// GET /user/:username  => fetch profile
router.get("/:username", async (req, res) => {
    const user = req.params.username;
    const db = await readDB();
    if (!db[user])
        return res.status(404).json({ error: "User not found" });
    const u = db[user];
    return res.json({
        username: user,
        coins: u.coins,
        stats: u.stats,
        golds: u.golds || []
    });
});
// POST /user/:username/addGold  body: { id, name, rarity, img }
router.post("/:username/addGold", async (req, res) => {
    const user = req.params.username;
    const gold = req.body;
    if (!gold || !gold.id)
        return res.status(400).json({ error: "Missing gold data" });
    const db = await readDB();
    if (!db[user])
        return res.status(404).json({ error: "User not found" });
    db[user].golds = db[user].golds || [];
    db[user].golds.push({ ...gold, obtainedAt: new Date().toISOString() });
    await writeDB(db);
    return res.json({ success: true, golds: db[user].golds });
});
export default router;
