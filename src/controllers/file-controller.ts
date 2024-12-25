import {Request, Response} from "express";
import path from "path";

const VIDEOS_DIR = "../../../uploads";

const uploadVideo = async (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({message: "No file uploaded"});
    }

    const videoPath = path.join(__dirname, VIDEOS_DIR, req.file.filename);

    return res.status(200).json({
        message: "File uploaded successfully",
        filePath: videoPath,
    });
};

export default {uploadVideo};
