import type {ParkingSlot, UserRole} from "@prisma/client";
import {ParkingSlotsUpdate, UserUpdate} from "./schemas";
import {SocketIOError} from "@/errors/custom-error";

export interface UserDTO {
    userId: string;
    username: string;
    role: UserRole;
    createdAt: Date;
}

export interface UserInToken {
    userId: string;
    username: string;
    role: UserRole;
}

export interface CardVehicle {
    cardId: string;
    licensePlate: string;
}

//Events
interface ClientEvents {
    "user:join": () => void;
    "user:leave": () => void;
    "user:update": (
        payload: UserUpdate & {userId: string},
        callback: (status: SocketIOError | undefined) => void
    ) => void;
    "parkingSlot:update": (
        payload: ParkingSlotsUpdate,
        callback: (status: SocketIOError | undefined) => void
    ) => void;
}

interface ServerEvents {
    "user:update": (payload: {userId: string}) => void;
    "parkingSlot:update": (payload: {parkingSlots: ParkingSlot[]}) => void;
}

export type {ClientEvents, ServerEvents};
