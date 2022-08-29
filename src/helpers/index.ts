import nodeHtmlToImage from "node-html-to-image";
import {readFileSync} from "fs";
import Jimp from "jimp";

export const getImageFromHtml = async (imgUrl: string, width: number, height: number): Promise<Buffer> => {
    // Process a POST request
    const image = await Jimp.read(imgUrl);

    const hex = `#${image.getPixelColor(0, 0).toString(16).substring(0, 6)}`;
    const templateFile = readFileSync(__dirname + '/../templates/bg-template.hbs', 'utf8');
    const overlayHeight = width / 6.6;
    return await nodeHtmlToImage({
        type: 'jpeg',
        html: templateFile,
        quality: 100,
        content: {
            height,
            width,
            overlayHeight,
            bgColor: hex,
            lemonImgUrl: imgUrl,
        },
        puppeteerArgs: {
            defaultViewport: {
                height,
                width,
                deviceScaleFactor: 2,
            },
        },
    }) as Buffer;
}