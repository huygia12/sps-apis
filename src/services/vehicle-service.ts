import prisma from "@/common/prisma-client";
import {VehicleInsertion, VehicleUpdate} from "@/common/schemas";
import {CardVehicle, UserDTO} from "@/common/types";
import CardNotFoundError from "@/errors/card/card-not-found";
import CardNotLinkedError from "@/errors/card/card-not-linked";
import {Card, Vehicle} from "@prisma/client";

const getCardLinkedToVehicle = async (
    cardCode: string
): Promise<CardVehicle> => {
    const rawData = await prisma.card.findFirst({
        where: {
            cardCode: cardCode,
        },
        include: {
            vehicle: true,
        },
    });

    if (!rawData) {
        throw new CardNotFoundError(`Card with id ${cardCode} cannot be found`);
    } else if (!rawData.vehicle) {
        throw new CardNotLinkedError(`Card is not linked to a vehicle`);
    }

    return {
        cardId: rawData.cardId,
        licensePlate: rawData.vehicle.licensePlate,
    };
};

const insertVehicle = async (
    validPayload: VehicleInsertion,
    card: Card,
    user: UserDTO
): Promise<Vehicle> => {
    const vehicle = await prisma.vehicle.create({
        data: {
            licensePlate: validPayload.licensePlate,
            cardId: card.cardId,
            userId: user.userId,
        },
        include: {
            card: true,
        },
    });

    return vehicle;
};

const updateVehicle = async (
    vehicleId: string,
    validPayload: VehicleUpdate
): Promise<void> => {
    await prisma.vehicle.update({
        where: {
            vehicleId: vehicleId,
        },
        data: {
            ...validPayload,
        },
    });
};

export default {
    getCardLinkedToVehicle,
    insertVehicle,
    updateVehicle,
};
