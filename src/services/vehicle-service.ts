import prisma from "@/common/prisma-client";
import {CardVehicle} from "@/common/types";

const getVehiclesLinkedToCard = async (): Promise<CardVehicle[]> => {
    const rawData = await prisma.vehicle.findMany({
        where: {
            cardId: {
                not: null,
            },
        },
        include: {
            card: {
                select: {
                    cardCode: true,
                },
            },
        },
    });

    const cardVehicles: CardVehicle[] = [];
    rawData.forEach((e) => {
        cardVehicles.push({
            licensePlate: e.licensePlate,
            cardId: e.card!.cardCode,
        });
    });

    return cardVehicles;
};

export default {
    getVehiclesLinkedToCard,
};
