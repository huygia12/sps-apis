import express from "express";
import vehiclesController from "@/controllers/vehicle-controller";
const router = express.Router();

router.post("/", vehiclesController.insertVehicle);

export default router;
