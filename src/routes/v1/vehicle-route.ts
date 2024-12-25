import express from "express";
import cardsVehiclesController from "@/controllers/vehicle-controller";
const router = express.Router();

router.get("/", cardsVehiclesController.getVehicleLinkedToCard);

export default router;
