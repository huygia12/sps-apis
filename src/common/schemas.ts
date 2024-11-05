import {RequestMethod, ResponseMessage} from "./constants";
import zod, {ZodSchema, z} from "zod";

const blankCheck = () =>
    zod
        .string()
        .trim()
        .refine((value) => value !== "", {
            message: ResponseMessage.BLANK_INPUT,
        });

const signupSchema = zod
    .object({
        username: blankCheck(),
        password: blankCheck().optional(),
    })
    .strict();

const loginSchema = zod
    .object({
        username: blankCheck(),
        password: blankCheck(),
    })
    .strict();

const userUpdateSchema = zod
    .object({
        username: blankCheck().optional(),
        fingerprint: blankCheck().optional(),
    })
    .strict()
    .refine(
        (value) => value.fingerprint || value.username,
        ResponseMessage.PAYLOAD_IS_REQUIRED
    );

const parkingSlotsUpdateSchema = zod
    .array(
        zod.object({
            slotId: z.number(),
            state: blankCheck().optional(),
        })
    )
    .refine((value) => value.length > 0, ResponseMessage.ARRAY_IS_EMPTY);

const parkingSlotsInitializationSchema = zod.object({
    numberOfSlot: z.number().gt(0).lt(20),
});

const cardUpdateSchema = zod.object({
    cardId: z.string(),
    userId: z.string().nullable().optional(),
});

const cardInsertionSchema = zod.object({
    cardId: z.string(),
});

export type UserSignup = z.infer<typeof signupSchema>;

export type UserLogin = z.infer<typeof loginSchema>;

export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type ParkingSlotsUpdate = z.infer<typeof parkingSlotsUpdateSchema>;

export type ParkingSlotsInitialization = z.infer<
    typeof parkingSlotsInitializationSchema
>;

export type CardUpdate = z.infer<typeof cardUpdateSchema>;

export type CardInsertion = z.infer<typeof cardInsertionSchema>;

export default {
    ["/users/signup"]: {
        [RequestMethod.POST]: signupSchema,
    },
    ["/users/login"]: {
        [RequestMethod.POST]: loginSchema,
    },
    ["/users/:id"]: {
        [RequestMethod.PUT]: userUpdateSchema,
    },
    ["users"]: {
        ["update"]: userUpdateSchema,
    },
    ["/parkingSlots"]: {
        [RequestMethod.PUT]: parkingSlotsUpdateSchema,
        [RequestMethod.POST]: parkingSlotsInitializationSchema,
    },
    ["parkingSlots"]: {
        ["update"]: parkingSlotsUpdateSchema,
    },
    ["/cards"]: {
        [RequestMethod.PUT]: cardUpdateSchema,
        [RequestMethod.POST]: cardInsertionSchema,
    },
} as {[key: string]: {[method: string]: ZodSchema}};
