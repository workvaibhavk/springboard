import { NextResponse } from "next/server";
import {auth, clerkClient} from "@clerk/nextjs/server"

export async function GET(){
  const {userId} = await auth();
  if (!userId) return NextResponse.json(
    {error: "unauthorised"},
    {status: 401}
)

const client = await clerkClient();
const user = await client.users.getUser(userId);
const enrNumber = user?.publicMetadata.enrNumber

return NextResponse.json({enrollmentNo: enrNumber})
}