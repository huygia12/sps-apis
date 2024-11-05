import express from "express";
import {expressSchemaValidator} from "@/middleware/schema-validator";
import {authMiddleware} from "@/middleware/auth-middleware";
import cardController from "@/controllers/card-controller";
const router = express.Router();

router.get("/", cardController.getCards);
router.post(
    "/",
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    expressSchemaValidator("/cards"),
    cardController.insertCard
);
router.put(
    "/",
    authMiddleware.isAuthorized,
    authMiddleware.isAdmin,
    expressSchemaValidator("/cards"),
    cardController.updateCard
);

export default router;
