import prisma from "@/common/prisma-client";
import {CardInsertion, CardUpdate} from "@/common/schemas";
import {Card} from "@prisma/client";

const getCards = async (): Promise<Card[]> => {
    const cards = await prisma.card.findMany();
    return cards;
};

const updateCard = async (validPayload: CardUpdate): Promise<void> => {
    await prisma.card.update({
        where: {
            cardId: validPayload.cardId,
        },
        data: {
            cardId: validPayload.cardId,
            userId: validPayload.userId,
        },
    });
};

const insertCard = async (validPayload: CardInsertion): Promise<void> => {
    await prisma.card.create({
        data: {
            cardId: validPayload.cardId,
        },
    });
};

export default {
    getCards,
    updateCard,
    insertCard,
};
