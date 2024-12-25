import type {UserRole} from "@prisma/client";

export interface UserDTO {
    userId: string;
    username: string;
    email: string;
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
