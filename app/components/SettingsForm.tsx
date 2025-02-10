"use client";

import { updateUserInfo } from "@/app/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Link } from '@/i18n/routing';
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
    <div className="max-w-5xl mx-auto mt-10 grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
      {/* Sidebar */}
      <Card className="hidden md:block p-4 shadow-md rounded-lg">
        <CardTitle className="text-lg font-semibold mb-4">Settings</CardTitle>
        <Tabs defaultValue="profile" orientation="vertical">
          <TabsList className="flex flex-col space-y-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Content */}
      <Card className="w-full shadow-lg rounded-lg">
        <Tabs defaultValue="profile">
          {/* Profile Settings */}
          <TabsContent value="profile">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={formAction} className="space-y-4">
                {/* Avatar + Change Picture */}
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20 border">
                    <AvatarImage src={previewImage} />
                    <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">Change Picture</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Select New Profile Picture</DialogTitle>
                      </DialogHeader>
                      {/* Aquí iría la lógica para seleccionar o subir una nueva imagen */}
                    </DialogContent>
                  </Dialog>
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

                {/* Error messages */}
                {state?.status === "error" && <p className="text-destructive">{state.message}</p>}

                {/* Buttons */}
                <div className="flex justify-end gap-3 mt-4">
                  <Button variant="secondary" asChild>
                    <Link href="/">Cancel</Link>
                  </Button>
                  <SubmitButton text="Save Changes" />
                </div>
              </form>
            </CardContent>
          </TabsContent>

          {/* Account Settings (Placeholder) */}
          <TabsContent value="account">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Account settings will be added here.</p>
            </CardContent>
          </TabsContent>

          {/* Security Settings (Placeholder) */}
          <TabsContent value="security">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Security Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Security settings will be added here.</p>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
