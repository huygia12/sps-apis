import prisma from "@/common/prisma-client";
import {CardInsertion, CardUpdate} from "@/common/schemas";
import {Card} from "@prisma/client";

const getCards = async (): Promise<Card[]> => {
    const cards = await prisma.card.findMany({
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
        },
    });

    return card;
};

const insertCard = async (validPayload: CardInsertion): Promise<void> => {
    await prisma.card.create({
        data: {
            cardCode: validPayload.cardCode,
        },
    });
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
};
