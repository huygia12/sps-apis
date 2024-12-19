import express from "express";
import cardsVehiclesController from "@/controllers/vehicle-controller";
const router = express.Router();

router.get("/", cardsVehiclesController.getCardsVehicles);

export default router;
