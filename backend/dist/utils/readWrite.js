import { promises as fs } from "fs";
import path from "path";
const DB_PATH = path.join(process.cwd(), "backend", "db", "users.json");
export async function readDB() {
    try {
        const raw = await fs.readFile(DB_PATH, "utf8");
        return raw.trim() ? JSON.parse(raw) : {};
    }
    catch (err) {
        if (err.code === "ENOENT") {
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            await fs.writeFile(DB_PATH, JSON.stringify({}, null, 2), "utf8");
            return {};
        }
        throw err;
    }
}
export async function writeDB(data) {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
