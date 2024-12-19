import {ResponseMessage} from "@/common/constants";
import {Request, Response} from "express";
import vehiclesService from "@/services/vehicle-service";
import {StatusCodes} from "http-status-codes";

const getVehiclesLinkedToCard = async (req: Request, res: Response) => {
    const vehicles = await vehiclesService.getVehiclesLinkedToCard();

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: vehicles,
    });
};

export default {
    getCardsVehicles: getVehiclesLinkedToCard,
};
