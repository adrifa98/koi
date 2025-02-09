"use server";

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Prisma, TypeOfVote } from "@prisma/client";
import { JSONContent } from "@tiptap/react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "./lib/db";

export async function updateUserInfo(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const imageUrl = formData.get("imageUrl") as string;

  try {
    // Verifica que username y email sean únicos (excepto para el usuario actual)
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { userName: username, id: { not: user.id } },
          { email: email, id: { not: user.id } },
        ],
      },
    });

    if (existingUser) {
      return {
        message: "This username or email is already in use.",
        status: "error",
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { userName: username, email, firstName, lastName, imageUrl },
    });

    return {
      message: "Successfully updated user information!",
      status: "green",
    };
  } catch (e) {
    return {
      message: "An unexpected error occurred.",
      status: "error",
    };
  }
}

export async function createCommunity(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const name = formData.get("name") as string;

    const data = await prisma.subreddit.create({
      data: {
        name: name,
        userId: user.id,
      },
    });

    return redirect(`/r/${data.name}`);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return {
          message: "This name is already used",
          status: "error",
        };
      }
    }
    throw e;
  }
}

export async function updateSubDescription(prevState: any, formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  try {
    const subName = formData.get("subName") as string;
    const description = formData.get("description") as string;

    await prisma.subreddit.update({
      where: { name: subName },
      data: { description },
    });

    return {
      status: "green",
      message: "Successfully updated the description!",
    };
  } catch (e) {
    return {
      status: "error",
      message: "Sorry, something went wrong!",
    };
  }
}

export async function createPost(
  { jsonContent }: { jsonContent: JSONContent | null },
  formData: FormData
) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const title = formData.get("title") as string;
  const imageUrl = formData.get("imageUrl") as string | null;
  const subName = formData.get("subName") as string;

  const data = await prisma.post.create({
    data: {
      title,
      imageString: imageUrl ?? undefined,
      subName,
      userId: user.id,
      textContent: jsonContent ?? undefined,
    },
  });

  return redirect(`/post/${data.id}`);
}

export async function handleVote(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const postId = formData.get("postId") as string;
  const voteDirection = formData.get("voteDirection") as TypeOfVote;

  const vote = await prisma.vote.findFirst({
    where: {
      postId: postId,
      userId: user.id,
    },
  });

  if (vote) {
    if (vote.voteType === voteDirection) {
      await prisma.vote.delete({
        where: { id: vote.id },
      });
    } else {
      await prisma.vote.update({
        where: { id: vote.id },
        data: { voteType: voteDirection },
      });
    }
  } else {
    await prisma.vote.create({
      data: {
        voteType: voteDirection,
        userId: user.id,
        postId: postId,
      },
    });
  }

  return revalidatePath("/", "page");
}

export async function createComment(formData: FormData) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return redirect("/api/auth/login");
  }

  const comment = formData.get("comment") as string;
  const postId = formData.get("postId") as string;

  const data = await prisma.comemnt.create({
    data: {
      text: comment,
      userId: user.id,
      postId: postId,
    },
  });

  revalidatePath(`/post/${postId}`);
}
