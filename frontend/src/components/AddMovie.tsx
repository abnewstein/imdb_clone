import React, { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import type { FieldApi } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SelectActors from "./SelectActor";
import { fetchActorList, fetchProducerList } from "@/lib/fetchers";

//eslint-disable-next-line
function FieldInfo({ field }: { field: FieldApi<any, any, any, any> }) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
    </>
  );
}

const AddMovie: React.FC = () => {
  const { data: actorList } = useQuery({
    queryKey: ["actorList"],
    queryFn: fetchActorList,
  });
  const { data: producerList } = useQuery({
    queryKey: ["producerList"],
    queryFn: fetchProducerList,
  });
  const actorsForSelect = useMemo(
    () =>
      actorList?.map((actor) => ({
        value: actor.id.toString(),
        label: actor.name,
      })) ?? [],
    [actorList]
  );

  const form = useForm({
    defaultValues: {
      name: "",
      yearOfRelease: "",
      plot: "",
      poster: "",
      producer: "",
      actors: [] as { name: string; id: string }[],
    },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <Card className="w-[350px] m-auto">
      <CardHeader>
        <CardTitle>Add a new Movie</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            console.log("submitting");
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <form.Field
                name="name"
                children={(field) => {
                  return (
                    <>
                      <label htmlFor={field.name}>Name :</label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <form.Field
                name="yearOfRelease"
                children={(field) => {
                  return (
                    <>
                      <label htmlFor={field.name}>Year of release :</label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <form.Field
                name="plot"
                children={(field) => {
                  return (
                    <>
                      <label htmlFor={field.name}>Plot :</label>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <form.Field
                name="poster"
                children={(field) => {
                  return (
                    <>
                      <label htmlFor={field.name}>Poster :</label>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <form.Field name="actors" mode="array">
                {(field) => {
                  return (
                    <div>
                      {field.state.value.map((_, i) => {
                        return (
                          <form.Field key={i} name={`actors[${i}].name`}>
                            {(subField) => {
                              return (
                                <div>
                                  <SelectActors
                                    actors={actorsForSelect}
                                    value={subField.state.value as string}
                                    onChange={subField.handleChange}
                                  />
                                </div>
                              );
                            }}
                          </form.Field>
                        );
                      })}
                      <button
                        onClick={() => field.pushValue({ name: "", id: "" })}
                        type="button"
                      >
                        Add actor
                      </button>
                    </div>
                  );
                }}
              </form.Field>
            </div>
            <div className="flex flex-col space-y-1.5">
              <form.Field
                name="producer"
                children={(field) => {
                  return (
                    <>
                      <Label htmlFor={field.name}>Producer</Label>
                      <Select
                        onValueChange={field.handleChange}
                        value={field.state.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a producer" />
                        </SelectTrigger>
                        <SelectContent>
                          {producerList?.map((producer) => (
                            <SelectItem
                              key={producer.id}
                              value={producer.id.toString()}
                            >
                              {producer.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldInfo field={field} />
                    </>
                  );
                }}
              />
            </div>
            <div className="flex justify-between">
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <>
                    <Button type="submit" disabled={!canSubmit}>
                      {isSubmitting ? "..." : "Add Movie"}
                    </Button>
                    <Button
                      type="reset"
                      onClick={() => {
                        form.reset();
                      }}
                      variant={"outline"}
                    >
                      Reset
                    </Button>
                  </>
                )}
              />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddMovie;
