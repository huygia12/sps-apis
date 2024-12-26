import prisma from "@/common/prisma-client";
import {VehicleInsertion, VehicleUpdate} from "@/common/schemas";
import {UserDTO} from "@/common/types";
import {Card, Vehicle} from "@prisma/client";

const insertVehicle = async (
    validPayload: VehicleInsertion,
    card: Card,
    user: UserDTO
): Promise<Vehicle> => {
    const data = await prisma.$transaction(async (prisma) => {
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

        await prisma.card.update({
            where: {
                cardId: card.cardId,
            },
            data: {
                userId: user.userId,
            },
        });
        return vehicle;
    });

    return data;
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
    insertVehicle,
    updateVehicle,
};
