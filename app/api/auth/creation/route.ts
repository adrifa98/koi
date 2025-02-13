import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { generateUsername } from "unique-username-generator";

export async function GET(req: NextRequest) {
  noStore();
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || user === null || !user.id)
    throw new Error("something went wrong please try again");

  let dbUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        id: user.id,
        email: user.email ?? "",
        firstName: user.given_name ?? "",
        lastName: user.family_name ?? "",
        imageUrl: user.picture,
        userName: generateUsername("-", 3, 15),
      },
    });
  }

  const redirectUrl = process.env.NODE_ENV === "development"
    ? process.env.KINDE_SITE_URL
    : `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

  if (!redirectUrl) {
    throw new Error("Redirect URL is not defined");
  }

  return NextResponse.redirect(redirectUrl);
}