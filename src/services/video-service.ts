import prisma from "@/common/prisma-client";

const insertVideo = async (validPayload: {
    createdAt: Date;
    url: string;
}): Promise<void> => {
    await prisma.video.create({
        data: {
            url: validPayload.url,
            createdAt: validPayload.createdAt,
        },
    });
};

export default {
    insertVideo,
};
