import webpush from "web-push";
import { prisma } from "@/lib/prisma";

export interface PushPayload {
    title: string;
    body: string;
    url?: string;
}

export async function sendPushToAdminsAndSellers(payload: PushPayload) {
    webpush.setVapidDetails(
        process.env.VAPID_SUBJECT!,
        process.env.VAPID_PUBLIC_KEY!,
        process.env.VAPID_PRIVATE_KEY!,
    );

    const subscriptions = await prisma.pushSubscription.findMany({
        where: {
            user: {
                role: { in: ["ADMIN", "SELLER"] },
                deletedAt: null,
            },
        },
    });

    if (subscriptions.length === 0) return;

    await Promise.allSettled(
        subscriptions.map((sub) =>
            webpush
                .sendNotification(
                    { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                    JSON.stringify(payload),
                )
                .catch(async (err) => {
                    // Remove expired/invalid subscriptions (410 Gone)
                    if (err?.statusCode === 410 || err?.statusCode === 404) {
                        await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
                    }
                }),
        ),
    );
}
