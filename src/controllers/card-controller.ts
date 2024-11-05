import {ResponseMessage} from "@/common/constants";
import {CardInsertion, CardUpdate} from "@/common/schemas";
import cardService from "@/services/card-service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

const getCards = async (req: Request, res: Response) => {
    const cards = await cardService.getCards();

    console.debug(`[card controller] get cards succeed`);
    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: cards,
    });
};

const insertCard = async (req: Request, res: Response) => {
    const newCard = req.body as CardInsertion;

    await cardService.insertCard(newCard);

    console.debug(`[card controller] insert card succeed`);
    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

const updateCard = async (req: Request, res: Response) => {
    const card = req.body as CardUpdate;

    await cardService.updateCard(card);

    console.debug(`[card controller] update card succeed`);
    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

export default {
    getCards,
    insertCard,
    updateCard,
};
