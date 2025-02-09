import { SettingsForm } from "@/app/components/SettingsForm";
import prisma from "@/app/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";

async function getData(userId: string) {
  noStore();
  const data = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      userName: true,
      email: true,
      firstName: true,
      lastName: true,
      imageUrl: true,
    },
  });

  return {
    userName: data?.userName ?? null,
    email: data?.email ?? null,
    firstName: data?.firstName ?? null,
    lastName: data?.lastName ?? null,
    imageUrl: data?.imageUrl ?? null,
  };
}

export default async function SettingsPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const data = await getData(user.id);

  return (
    <div className="max-w-[1000px] mx-auto flex flex-col mt-4">
      <SettingsForm 
        username={data.userName} 
        email={data.email} 
        firstName={data.firstName} 
        lastName={data.lastName} 
        imageUrl={data.imageUrl} 
      />
    </div>
  );
}
