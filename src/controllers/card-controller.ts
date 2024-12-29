import {ResponseMessage} from "@/common/constants";
import {CardInsertion, CardUpdate} from "@/common/schemas";
import cardService from "@/services/card-service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import axios from "axios";
import config from "@/common/app-config";

const getCards = async (req: Request, res: Response) => {
    const available = Number(req.query.available);
    const cards = await cardService.getCards({
        userId: available == 1 ? null : undefined,
    });

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: cards,
    });
};

const insertCard = async (req: Request, res: Response) => {
    const reqBody = req.body as CardInsertion;

    const card = await cardService.insertCard(reqBody);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: card,
    });
};

const updateCard = async (req: Request, res: Response) => {
    const cardId = req.params.id as string;
    const reqBody = req.body as CardUpdate;

    const card = await cardService.updateCard(cardId, reqBody);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: card,
    });
};

const deleteCard = async (req: Request, res: Response) => {
    const cardId = req.params.id as string;

    await cardService.deleteCard(cardId);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

const validateCard = async (req: Request, res: Response) => {
    let cardId = req.query.cardId as string;
    if (typeof cardId === "string") {
        cardId = cardId.trim();
        console.log(cardId);
    }
    const vehicle = await cardService.getCardLinkedToVehicle(cardId);

    try {
        await axios.post(
            config.CAMERA_SERVER_API + `/validate-car-plate?timeout=5000`,
            {
                plate_number: vehicle.licensePlate,
            }
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
                message: "Failed to validate car license plate",
            });
        } else {
            throw new Error("Unexpected error: " + error);
        }
    }

    return res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

export default {
    getCards,
    insertCard,
    updateCard,
    deleteCard,
    validateCard,
};
