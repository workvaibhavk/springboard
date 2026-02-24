// api/admin/users
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request) {
    try {
        const client = await clerkClient();
        const users = client?.users.getUserList({
            limit: 100,
            offset: 0,
        });

        return Response.json({
            users: await users,
        });

    } catch (error) {
        console.error("API ERROR:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
