import express, {Express} from "express";
import {readFileSync} from "fs";
import {createServer} from 'http';
import Jimp from 'jimp';
import nodeHtmlToImage from 'node-html-to-image';

const app: Express = express();

// elaborate and parse request data
app.use(express.json({limit: "10mb"}));

app.post('/api/images', async (req, res) => {
    const { imgUrl, width, height } = req.body;
    // Process a POST request
    const image = await Jimp.read(imgUrl);
    const templateFile = readFileSync(__dirname + '/bg-template.hbs', 'utf8');
    const hex = `#${image.getPixelColor(0, 0).toString(16).substring(0, 6)}`;
    const w = parseInt(width, 10) ?? 828;
    const h = parseInt(height, 10) ?? 1792;
    const overlayHeight = w / 6.6;
    const img = await nodeHtmlToImage({
        type: 'jpeg',
        html: templateFile,
        quality: 100,
        content: {
            height: h,
            width: w,
            overlayHeight,
            bgColor: hex,
            lemonImgUrl: imgUrl,
        },
        puppeteerArgs: {
            defaultViewport: {
                height: h,
                width: w,
                deviceScaleFactor: 2,
            },
        },
    });
    res.json({ data: (img as Buffer).toString('base64') });
});

createServer(app).listen(3001);