import {ResponseMessage} from "@/common/constants";
import {ParkingSlotsInitialization, ParkingSlotsUpdate} from "@/common/schemas";
import {ClientEvents, ServerEvents} from "@/common/types";
import {socketIOSchemaValidator} from "@/middleware/schema-validator";
import parkingSlotService from "@/services/parking-slot-service";
import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import {Server, Socket} from "socket.io";

const getParkingSlots = async (req: Request, res: Response) => {
    const slotsStatus = await parkingSlotService.getSlotsStatus();

    console.debug(`[parking slots controller] get slots status succeed`);
    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: slotsStatus,
    });
};

const initParkingSlots = async (req: Request, res: Response) => {
    const numberOfParkingSlots = req.body as ParkingSlotsInitialization;
    await parkingSlotService.createSlots(numberOfParkingSlots);

    console.debug(`[parking slots controller] init slots succeed`);
    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

const updateParkingSlots = async (req: Request, res: Response) => {
    const parkingStates = req.body as ParkingSlotsUpdate;

    await parkingSlotService.updateSlotsStatus(parkingStates);

    console.debug(`[parking slots controller] update status succeed`);
    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

const registerParkingSlotSocketHandlers = (
    io: Server<ClientEvents, ServerEvents>,
    socket: Socket<ClientEvents, ServerEvents>
) => {
    const updateState = async (
        payload: ParkingSlotsUpdate,
        callback: unknown
    ) => {
        if (typeof callback !== "function") {
            //not an acknowledgement
            return socket.disconnect();
        }
        const validateResult: boolean = socketIOSchemaValidator(
            `parkingSlot:update`,
            payload,
            callback
        );
        if (!validateResult) return;

        try {
            await parkingSlotService.updateSlotsStatus(payload);
            const newState = await parkingSlotService.getSlotsStatus();

            io.emit("parkingSlot:update", {
                parkingSlots: newState,
            });
            callback(undefined);
            console.debug(
                `[parkingslot controller] update parking slots state succeed`
            );
        } catch (error) {
            if (error instanceof Error) {
                console.error(`[error handler] ${error.name} : ${error.stack}`);
            } else {
                console.error(`[error handler] unexpected error : ${error}`);
            }

            callback({
                status: StatusCodes.INTERNAL_SERVER_ERROR,
                message: ResponseMessage.UNEXPECTED_ERROR,
            });
        }
    };

    socket.on(`parkingSlot:update`, updateState);
};

export default {
    updateParkingSlots,
    getParkingSlots,
    initParkingSlots,
    registerParkingSlotSocketHandlers,
};
