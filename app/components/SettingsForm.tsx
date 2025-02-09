"use client";

import { updateUserInfo } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "./SubmitButtons";

const initialState = { message: "", status: "" };

export function SettingsForm({ username, email, firstName, lastName, imageUrl }: {
  username: string | null;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}) {
  const [state, formAction] = useFormState(updateUserInfo, initialState);
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState(imageUrl || "/default-avatar.png");

  useEffect(() => {
    if (state?.status === "green") {
      toast({ title: "Success", description: state.message });
    } else if (state?.status === "error") {
      toast({ title: "Error", description: state.message, variant: "destructive" });
    }
  }, [state, toast]);

  return (
    <Card className="max-w-[600px] mx-auto mt-6 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {/* Imagen de perfil */}
          <div className="flex items-center gap-4">
            <img src={previewImage} alt="Profile" className="w-20 h-20 rounded-full border" />
            <Button variant="outline" type="button" onClick={() => alert("Image Selector (Pending)")}>
              Change Profile Picture
            </Button>
          </div>

          <Separator />

          {/* Username */}
          <div>
            <Label className="text-lg">Username</Label>
            <Input defaultValue={username ?? ""} name="username" required minLength={2} maxLength={21} />
          </div>

          {/* Email */}
          <div>
            <Label className="text-lg">Email</Label>
            <Input type="email" defaultValue={email ?? ""} name="email" required />
          </div>

          {/* First Name */}
          <div>
            <Label className="text-lg">First Name</Label>
            <Input defaultValue={firstName ?? ""} name="firstName" required />
          </div>

          {/* Last Name */}
          <div>
            <Label className="text-lg">Last Name</Label>
            <Input defaultValue={lastName ?? ""} name="lastName" required />
          </div>

          {/* Mensajes de error */}
          {state?.status === "error" && <p className="text-destructive">{state.message}</p>}

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" asChild>
              <Link href="/">Cancel</Link>
            </Button>
            <SubmitButton text="Save Changes" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
