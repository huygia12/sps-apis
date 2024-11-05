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
    // const ids = retriveSlotIds(validPayload);
    const slotsStatus = await prisma.parkingSlot.updateMany({
        // where: {
        //     slotId: {
        //         in: ids,
        //     },
        // },
        data: validPayload,
    });
};

const retriveSlotIds = (parkingSlot: ParkingSlot[]): number[] => {
    return parkingSlot.map((slot) => slot.slotId);
};

const getInsertSlotsObject = (numberOfSlots: number) => {
    return Array.from({length: numberOfSlots}, (_, i) => ({
        slotId: i + 1,
    }));
};

export default {getSlotsStatus, updateSlotsStatus, createSlots};
