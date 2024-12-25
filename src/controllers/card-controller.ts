import {ResponseMessage} from "@/common/constants";
import {CardInsertion, CardUpdate} from "@/common/schemas";
import cardService from "@/services/card-service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

const getCards = async (req: Request, res: Response) => {
    const available = Boolean(req.query.available);
    const cards = await cardService.getCards({
        userId: available ? null : undefined,
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

export default {
    getCards,
    insertCard,
    updateCard,
    deleteCard,
};
