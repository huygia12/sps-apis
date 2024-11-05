import express, {Request, Response} from "express";
import userRoute from "@/routes/v1/user-route";
import cardRoute from "@/routes/v1/card-route";
import parkingSlotsRoute from "@/routes/v1/parking-slot-route";
import {NextFunction} from "express-serve-static-core";

const router = express.Router();
const space = (req: Request, res: Response, next: NextFunction) => {
    console.log("\n");
    next();
};

router.use("/v1/users", space, userRoute);
router.use("/v1/cards", space, cardRoute);
router.use("/v1/parkingSlots", space, parkingSlotsRoute);
router.get("/healthcheck", (req: Request, res: Response) =>
    res.sendStatus(200)
);
export const API_v1 = router;
