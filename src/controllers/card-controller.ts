import {ResponseMessage} from "@/common/constants";
import {CardInsertion, CardUpdate} from "@/common/schemas";
import cardService from "@/services/card-service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

const getCards = async (req: Request, res: Response) => {
    const cards = await cardService.getCards();

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: cards,
    });
};

const insertCard = async (req: Request, res: Response) => {
    const newCard = req.body as CardInsertion;

    await cardService.insertCard(newCard);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

const updateCard = async (req: Request, res: Response) => {
    const cardId = req.params.cardId as string;
    const cardUpdate = req.body as CardUpdate;

    const card = await cardService.updateCard(cardId, cardUpdate);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: card,
    });
};

const deleteCard = async (req: Request, res: Response) => {
    const cardId = req.params.cardId as string;

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
