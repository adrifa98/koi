'use server';

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export async function getAuthStatus() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  return {
    isAuthenticated: !!user,
    user: user
      ? {
          name: user.given_name || "Usuario",
          email: user.email || "", // Asegurar que email siempre sea un string
          picture: user.picture || undefined, // Asegurar que picture sea undefined si no existe
        }
      : null,
  };
}