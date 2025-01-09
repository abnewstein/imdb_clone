import React, { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldInfo from "./FieldInfo";
import { type CreateActorPayload } from "@/lib/types";
import {
  createActorSchema,
  createProducerSchema,
  type Gender,
} from "@server/sharedTypes";
import { api } from "@/lib/api";

const AddActorOrProducerDialog: React.FC = () => {
  const [selectedPersonRole, setSelectedPersonRole] = useState<string>("Actor");
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (person: CreateActorPayload) => {
      const backendApi =
        selectedPersonRole === "Actor" ? api.actors : api.producers;
      const res = await backendApi.$post({ json: person });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["actorList"],
      });
      queryClient.invalidateQueries({
        queryKey: ["producerList"],
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      gender: "" as unknown,
      dateOfBirth: "",
      bio: "",
    } as CreateActorPayload,
    onSubmit: async ({ value }) => {
      const formattedValue = {
        ...value,
        gender: value.gender as unknown as Gender,
      };
      mutation.mutate(formattedValue);
    },
    validators: {
      onChange:
        selectedPersonRole === "Actor"
          ? createActorSchema
          : createProducerSchema,
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add new Actor / Producer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form
          onSubmit={(e) => {
            console.log("submitting");
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <DialogHeader className="flex items-center">
            <DialogTitle>{`Add a new ${selectedPersonRole}`}</DialogTitle>
            <DialogDescription>
              Enter the person's details and Click save when you're done.
            </DialogDescription>
            <RadioGroup
              defaultValue={selectedPersonRole}
              onValueChange={setSelectedPersonRole}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Actor" id="r1" />
                <Label htmlFor="r1">Actor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Producer" id="r2" />
                <Label htmlFor="r2">Producer</Label>
              </div>
            </RadioGroup>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <form.Field
                name="name"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name} className="text-right">
                        Name
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="col-span-3"
                      />
                      <FieldInfo
                        field={field}
                        className="text-right col-span-4 text-sm"
                      />
                    </>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <form.Field
                name="gender"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name} className="text-right">
                        Gender
                      </Label>
                      <Select
                        onValueChange={field.handleChange}
                        value={field.state.value}
                      >
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem key="male" value="male">
                            Male
                          </SelectItem>
                          <SelectItem key="female" value="female">
                            Female
                          </SelectItem>
                          <SelectItem key="other" value="other">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldInfo
                        field={field}
                        className="text-right col-span-4 text-sm"
                      />
                    </>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <form.Field
                name="dateOfBirth"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name} className="text-right">
                        Date of Birth
                      </Label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="col-span-3"
                      />
                      <FieldInfo
                        field={field}
                        className="text-right col-span-4 text-sm"
                      />
                    </>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <form.Field
                name="bio"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name} className="text-right">
                        Bio
                      </Label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value ?? ""}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className="col-span-3"
                      />
                      <FieldInfo
                        field={field}
                        className="text-right col-span-4 text-sm"
                      />
                    </>
                  );
                }}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-between mt-4 gap-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <Button type="submit" disabled={!canSubmit} className="">
                    {isSubmitting ? "..." : `Save ${selectedPersonRole}`}
                  </Button>
                  <Button
                    type="reset"
                    onClick={() => {
                      form.reset();
                    }}
                    variant={"outline"}
                    className="ml-auto"
                  >
                    Reset
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                </>
              )}
            />
          </DialogFooter>
        </form>
        {mutation.isError ? (
          <div className="text-red-600">{mutation.error.message}</div>
        ) : null}
        {mutation.isSuccess ? (
          <div className="text-green-600">{`${selectedPersonRole} added successfully! 🎉`}</div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AddActorOrProducerDialog;
