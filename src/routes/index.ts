import express, {Request, Response} from "express";
import userRoute from "@/routes/v1/user-route";
import cardRoute from "@/routes/v1/card-route";
import videoRoute from "@/routes/v1/video-route";
import vehicleRoute from "@/routes/v1/vehicle-route";
import parkingSlotsRoute from "@/routes/v1/parking-slot-route";
import {NextFunction} from "express-serve-static-core";

const router = express.Router();
const space = (req: Request, res: Response, next: NextFunction) => {
    console.log("\n");
    next();
};

router.use("/api/v1/users", space, userRoute);
router.use("/api/v1/cards", space, cardRoute);
router.use("/api/v1/publish-video", space, videoRoute);
router.use("/api/v1/parkingSlots", space, parkingSlotsRoute);
router.use("/api/v1/vehicles", space, vehicleRoute);
router.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
);
export const API_v1 = router;
