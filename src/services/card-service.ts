import {ResponseMessage} from "@/common/constants";
import prisma from "@/common/prisma-client";
import {CardInsertion, CardUpdate} from "@/common/schemas";
import CardNotFoundError from "@/errors/card/card-not-found";
import {Card} from "@prisma/client";

const getCards = async (params: {userId?: null | string}): Promise<Card[]> => {
    const cards = await prisma.card.findMany({
        where: {
            userId: params.userId,
        },
        include: {
            user: {
                select: {
                    userId: true,
                    username: true,
                },
            },
        },
    });
    return cards;
};

const isOccupied = async (cardId: string): Promise<boolean> => {
    const card = await prisma.card.findFirst({
        where: {
            cardId: cardId,
        },
    });

    if (!card) throw new CardNotFoundError(ResponseMessage.NOT_FOUND);

    return card.userId !== null;
};

const updateCard = async (
    cardId: string,
    validPayload: CardUpdate
): Promise<Card> => {
    const card = await prisma.card.update({
        where: {
            cardId: cardId,
        },
        data: {
            cardCode: validPayload.cardCode,
            name: validPayload.name,
        },
        include: {
            user: {
                select: {
                    userId: true,
                    username: true,
                },
            },
        },
    });

    return card;
};

const insertCard = async (validPayload: CardInsertion): Promise<Card> => {
    const result = await prisma.card.create({
        data: {
            cardCode: validPayload.cardCode,
            name: validPayload.name,
        },
        include: {
            user: {
                select: {
                    userId: true,
                    username: true,
                },
            },
        },
    });

    return result;
};

const deleteCard = async (cardId: string): Promise<void> => {
    await prisma.card.delete({
        where: {
            cardId: cardId,
        },
    });
};

export default {
    getCards,
    updateCard,
    insertCard,
    deleteCard,
    isOccupied,
};
