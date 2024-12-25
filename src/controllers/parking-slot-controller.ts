import {ResponseMessage} from "@/common/constants";
import {ParkingSlotsInitialization, ParkingSlotsUpdate} from "@/common/schemas";
import parkingSlotService from "@/services/parking-slot-service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";

const getParkingSlots = async (req: Request, res: Response) => {
    const slotsStatus = await parkingSlotService.getSlotsStatus();

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: slotsStatus,
    });
};

const initParkingSlots = async (req: Request, res: Response) => {
    const numberOfParkingSlots = req.body as ParkingSlotsInitialization;
    await parkingSlotService.createSlots(numberOfParkingSlots);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

const updateParkingSlots = async (req: Request, res: Response) => {
    const parkingStates = req.body as ParkingSlotsUpdate;

    await parkingSlotService.updateSlotsStatus(parkingStates);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

export default {
    updateParkingSlots,
    getParkingSlots,
    initParkingSlots,
};
