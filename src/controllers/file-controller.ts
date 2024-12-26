import {Request, Response} from "express";
import path from "path";
import videoService from "@/services/video-service";
import {ResponseMessage} from "@/common/constants";

const VIDEOS_DIR = "../../uploads";

const uploadVideo = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({message: "No file uploaded"});
    }
    const fileName = req.file.filename as string;
    console.log(__dirname, VIDEOS_DIR, fileName);
    const videoPath = path.join(__dirname, VIDEOS_DIR, fileName);

    const dateString = fileName.split("_")[1];
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1;
    const day = parseInt(dateString.slice(6, 8), 10);
    const hour = parseInt(dateString.slice(8, 10), 10);
    const minute = parseInt(dateString.slice(10, 12), 10);
    const second = parseInt(dateString.slice(12, 14), 10);

    const createdAt = new Date(year, month, day, hour, minute, second);

    await videoService.insertVideo({createdAt: createdAt, url: videoPath});

    return res.status(200).json({
        message: ResponseMessage.SUCCESS,
        filePath: videoPath,
    });
};

export default {uploadVideo};
