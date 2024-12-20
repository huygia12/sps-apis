import {Request, Response} from "express";
import {StatusCodes} from "http-status-codes";
import jwtService from "@/services/jwt-service";
import userService from "@/services/user-service";
import {UserLogin, UserSignup, UserUpdate} from "@/common/schemas";
import {ClientEvents, ServerEvents, UserDTO, UserInToken} from "@/common/types";
import {AuthToken, ResponseMessage} from "@/common/constants";
import MissingTokenError from "@/errors/auth/missing-token";
import {Server, Socket} from "socket.io";
import {socketIOSchemaValidator} from "@/middleware/schema-validator";
import ms from "ms";
import UserNotFoundError from "@/errors/user/user-not-found";
import {UserRole} from "@prisma/client";

/**
 * If updated username had already been existed in DB, return conflict status
 *
 * @param {Request} req
 * @param {Response} res
 */
const signup = async (req: Request, res: Response) => {
    const userSignup = req.body as UserSignup;

    const user = await userService.insertUser(userSignup);

    res.status(StatusCodes.CREATED).json({
        message: ResponseMessage.SUCCESS,
        info: user,
    });
};

/**
 * Log user in the user
 * If the current tokens are still valid, then return `Already login`
 * If not, create tokens and send back in header and cookie
 *
 * @param {Request} req
 * @param {Response} res
 */
const login = async (req: Request, res: Response) => {
    const loginReq = req.body as UserLogin;
    const accessToken = req.headers["authorization"] as string | undefined;
    const refreshToken = req.cookies.refreshToken as string | undefined;

    const tokens = await userService.login(accessToken, refreshToken, loginReq);

    //set token to cookie
    res.cookie(AuthToken.RF, tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms(jwtService.REFRESH_TOKEN_LIFE_SPAN),
    });

    return res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: {
            accessToken: tokens.accessToken,
        },
    });
};

/**
 * Log user out, clear user's token
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
const logout = async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken as string;

    if (refreshToken) {
        const user = jwtService.decodeToken(refreshToken) as UserInToken;

        await userService.logout(refreshToken, user.userId);
    }

    res.removeHeader("Authorization");
    res.clearCookie(AuthToken.RF);
    res.status(StatusCodes.OK).json({message: ResponseMessage.SUCCESS});
};

/**
 * Make new access token. Also checking if DB is containing this refresh token or not
 * If not, then clear all the refresh token in the DB and user must login again for new valid refresh token
 *
 * @param {Request} req
 * @param {Response} res
 */
const refreshToken = async (req: Request, res: Response) => {
    const rtFromCookie = req.cookies.refreshToken as string;

    if (!rtFromCookie) {
        throw new MissingTokenError(ResponseMessage.TOKEN_MISSING);
    }

    const tokens = await userService.refreshToken(rtFromCookie);
    //set two token to cookie
    res.cookie(AuthToken.RF, tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: ms(jwtService.REFRESH_TOKEN_LIFE_SPAN),
    });
    return res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: {
            accessToken: tokens.accessToken,
        },
    });
};

/**
 * Update user fingerprint or name
 * If updated username had already been existed in DB, return conflict status
 *
 * @param {Request} req
 * @param {Response} res
 */
const updateInfo = async (req: Request, res: Response) => {
    const userID = req.params.id as string;
    const userUpdate = req.body as UserUpdate;

    const updatedUser: UserDTO = await userService.updateUser(
        userID,
        userUpdate
    );

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: updatedUser,
    });
};

/**
 * Can get any kind of user
 * @param req
 * @param res
 */
const getUser = async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    const user: UserDTO | null = await userService.getUserDTO(userId);

    if (!user) {
        throw new UserNotFoundError(ResponseMessage.USER_NOT_FOUND);
    }

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: user,
    });
};

/**
 * Can only get customers
 * @param req
 * @param res
 */
const getUsers = async (req: Request, res: Response) => {
    const users: UserDTO[] = await userService.getUserDTOs({
        role: UserRole.CUSTOMER,
    });

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
        info: users,
    });
};

const deleteUser = async (req: Request, res: Response) => {
    const userId = req.params.id as string;

    await userService.deleteUser(userId);

    res.status(StatusCodes.OK).json({
        message: ResponseMessage.SUCCESS,
    });
};

const registerUserSocketHandlers = (
    io: Server<ClientEvents, ServerEvents>,
    socket: Socket<ClientEvents, ServerEvents>
) => {
    const updateUser = async (
        payload: UserUpdate & {userId: string},
        callback: unknown
    ) => {
        if (typeof callback !== "function") {
            //not an acknowledgement
            return socket.disconnect();
        }
        const validateResult: boolean = socketIOSchemaValidator(
            `user:update`,
            payload,
            callback
        );
        if (!validateResult) return;

        try {
            await userService.updateUser(payload.userId, payload);

            io.to(`user:${UserRole.STAFF}`).emit("user:update", {
                userId: payload.userId,
            });
            callback(undefined);
            console.debug(
                `[user controller] update user ${payload.username} succeed`
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

    socket.on(`user:update`, updateUser);
    socket.on(`user:join`, () => {
        socket.join(`user:${UserRole.STAFF}`);
        console.debug(`[socket server]: join user to staff room`);
    });
    socket.on(`user:leave`, () => {
        socket.leave(`user:${UserRole.STAFF}`);
        console.debug(`[socket server]: user leaving from staff room`);
    });
};

export default {
    signup,
    login,
    logout,
    refreshToken,
    updateInfo,
    getUser,
    getUsers,
    deleteUser,
    registerUserSocketHandlers,
};
