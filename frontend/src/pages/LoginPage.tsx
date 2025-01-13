import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddUserPayload } from "@/lib/types";
import { createUserSchema } from "@server/sharedTypes";
import { authApi } from "@/lib/api";
import { type UserData } from "@/userStore";
import FieldInfo from "@/components/FieldInfo";

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (user: AddUserPayload) => {
      const res = await authApi.register.$post({
        json: user,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      queryClient.setQueryData<UserData>(["user-data"], {
        username: user.username,
        token: data?.data?.token,
      });
      console.log("login successful");

      return data;
    },
  });
  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    } as AddUserPayload,
    onSubmit: async ({ value }) => {
      mutation.mutate(value);
    },
    validators: {
      onChange: createUserSchema,
    },
  });
  const toggleMode = () => {
    setIsRegister(!isRegister);
  };

  return (
    <Card className="w-[450px] m-auto mt-20">
      <CardHeader>
        <CardTitle>{isRegister ? "Register" : "Login"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <form.Field
              name="username"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Username</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
          <div>
            <form.Field
              name="password"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field} />
                  </>
                );
              }}
            />
          </div>
          <Button type="submit" className="w-full">
            {isRegister ? "Register" : "Login"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Button variant="link" onClick={toggleMode}>
            {isRegister
              ? "Already have an account? Login"
              : "Don't have an account? Register"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
