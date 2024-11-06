import prisma from "@/common/prisma-client";
import {ParkingSlotsInitialization, ParkingSlotsUpdate} from "@/common/schemas";
import {ParkingSlot} from "@prisma/client";

const getSlotsStatus = async (): Promise<ParkingSlot[]> => {
    const slotsStatus = await prisma.parkingSlot.findMany();

    return slotsStatus;
};

const createSlots = async (
    validPayload: ParkingSlotsInitialization
): Promise<void> => {
    await prisma.parkingSlot.createMany({
        data: getInsertSlotsObject(validPayload.numberOfSlot),
    });
};

const updateSlotsStatus = async (
    validPayload: ParkingSlotsUpdate
): Promise<void> => {
    const query = `
        UPDATE "ParkingSlot"
        SET "state" = CASE
            ${validPayload.map((update) => `WHEN "slotId" = ${update.slotId} THEN '${update.state}'`).join("\n")}
            ELSE "state"
        END
        WHERE "slotId" IN (${getIds(validPayload).join(", ")});
        `;

    await prisma.$executeRawUnsafe(query);
};

const getIds = (data: {slotId: number}[]) => {
    return data.map((item) => item.slotId);
};

const getInsertSlotsObject = (numberOfSlots: number) => {
    return Array.from({length: numberOfSlots}, (_, i) => ({
        slotId: i + 1,
    }));
};

export default {getSlotsStatus, updateSlotsStatus, createSlots};
