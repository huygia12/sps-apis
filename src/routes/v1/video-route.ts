import express from "express";
import fileController from "@/controllers/file-controller";
import {upload} from "@/common/multer-config";
const router = express.Router();

router.post("/", upload.single("video"), fileController.uploadVideo);

export default router;
