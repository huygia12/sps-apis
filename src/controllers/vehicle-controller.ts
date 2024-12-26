import {ResponseMessage} from "@/common/constants";
import {Request, Response} from "express";
import vehicleService from "@/services/vehicle-service";
import cardService from "@/services/card-service";
import userService from "@/services/user-service";
import {StatusCodes} from "http-status-codes";
import {VehicleInsertion, VehicleUpdate} from "@/common/schemas";
import RunoutOfCardError from "@/errors/card/run-out-of-card";
import UserNotFoundError from "@/errors/user/user-not-found";
import CardOccupiedError from "@/errors/card/card-occupied";

const updateVehicle = async (req: Request, res: Response) => {
    const vehicleId = req.params.id as string;
    const reqBody = req.body as VehicleUpdate;

    if (reqBody.cardId && (await cardService.isOccupied(reqBody.cardId)))
        throw new CardOccupiedError(`Card is occupied`);

    const vehicle = await vehicleService.updateVehicle(vehicleId, reqBody);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: vehicle,
    });
};

const insertVehicle = async (req: Request, res: Response) => {
    const reqBody = req.body as VehicleInsertion;

    const user = await userService.getUserDTO(reqBody.userId);
    if (!user) throw new UserNotFoundError(ResponseMessage.NOT_FOUND);

    const availableCards = await cardService.getCards({userId: null});

    if (availableCards.length <= 0)
        throw new RunoutOfCardError(
            `Run out of cards, please insert more before continuing`
        );

    const selectedCard = availableCards[0];
    const vehicle = await vehicleService.insertVehicle(
        reqBody,
        selectedCard,
        user
    );

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: vehicle,
    });
};

export default {
    insertVehicle,
    updateVehicle,
};
