import express from "express";
import fileController from "@/controllers/file-controller";
import {upload} from "@/common/multer-config";
import {authMiddleware} from "@/middleware/auth-middleware";
const router = express.Router();

router.post("/publish", upload.single("video"), fileController.uploadVideo);
router.get(
    "/",
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    fileController.getVideos
);
router.get(
    "/:id",
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    fileController.getVideo
);

export default router;
