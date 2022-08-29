import express, {Express} from "express";
import {getImageFromHtml} from "../helpers";

const app: Express = express();

// elaborate and parse request data
app.use(express.json({limit: "10mb"}));

app.post('/api/images', async (req, res) => {
    const { imgUrl, width, height } = req.body;

    const w = parseInt(width, 10) ?? 828;
    const h = parseInt(height, 10) ?? 1792;

    const img = await getImageFromHtml(imgUrl, w, h)
    res.json({ data: img.toString('base64') });
});

export default app;