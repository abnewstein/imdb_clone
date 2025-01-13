import React, { useMemo } from "react";
import { useForm } from "@tanstack/react-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SquareX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FieldInfo from "./FieldInfo";
import AddActorOrProducerDialog from "./AddActorOrProducerDialog";
import SelectActorPopover from "./SelectActorPopover";
import { fetchActorList, fetchProducerList } from "@/lib/fetchers";
import { api } from "@/lib/api";
import { type CreateMovie, Movie } from "@server/sharedTypes";
import { type AddMoviePayload, addMovieSchema } from "@/lib/types";

type AddMovieProps = {
  movieDetails?: Movie;
};

const AddMovie: React.FC<AddMovieProps> = ({ movieDetails }) => {
  const queryClient = useQueryClient();
  const { data: actorList } = useQuery({
    queryKey: ["actorList"],
    queryFn: fetchActorList,
  });
  const { data: producerList } = useQuery({
    queryKey: ["producerList"],
    queryFn: fetchProducerList,
  });
  const actorsListForSelect = useMemo(
    () =>
      actorList?.map((actor) => ({
        value: actor.id.toString(),
        label: actor.name,
      })) ?? [],
    [actorList]
  );
  const mutation = useMutation({
    mutationFn: async (movie: CreateMovie) => {
      let res;
      if (movieDetails?.id) {
        res = await api.movies[":id"].$put({
          param: { id: movieDetails.id.toString() },
          json: movie,
        });
      } else {
        res = await api.movies.$post({ json: movie });
      }
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["movieList"],
      });
    },
  });

  const form = useForm({
    defaultValues: {
      name: movieDetails?.name ?? "",
      yearOfRelease: movieDetails?.yearOfRelease.toString() ?? "",
      plot: movieDetails?.plot ?? "",
      producerId: movieDetails?.producer?.id.toString() ?? "",
      actorIds:
        movieDetails?.actors.map((actor) => ({
          id: actor.id.toString(),
        })) ?? ([] as { id: string }[]),
    } as AddMoviePayload,
    onSubmit: async ({ value }) => {
      const formattedValue = {
        ...value,
        yearOfRelease: parseInt(value.yearOfRelease),
        producerId: parseInt(value.producerId),
        actorIds: value.actorIds.map((actor) => parseInt(actor.id)),
      };
      mutation.mutate(formattedValue);
    },
    validators: {
      onChange: addMovieSchema,
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
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
                    <Label htmlFor={field.name}>Name :</Label>
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
          <div className="flex flex-col space-y-1.5">
            <form.Field
              name="yearOfRelease"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Year of release :</Label>
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
          <div className="flex flex-col space-y-1.5">
            <form.Field
              name="plot"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Plot :</Label>
                    <Textarea
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
          <div className="flex flex-col space-y-1.5">
            <form.Field name="actorIds" mode="array">
              {(field) => {
                return (
                  <div className="flex flex-col space-y-1.5 gap-2">
                    <Label htmlFor={field.name}>Actors :</Label>
                    {field.state.value.map((value, i) => {
                      return (
                        <form.Field key={i} name={`actorIds[${i}].id`}>
                          {(subField) => {
                            return (
                              <>
                                <div className="flex justify-between gap-2">
                                  <SelectActorPopover
                                    actors={actorsListForSelect.filter(
                                      (actor) =>
                                        !field.state.value.some(
                                          (actorId) =>
                                            actorId.id === actor.value &&
                                            actorId.id !== subField.state.value
                                        )
                                    )}
                                    value={subField.state.value}
                                    defaultValue={value.id}
                                    onChange={subField.handleChange}
                                  />
                                  <Button
                                    onClick={() => field.removeValue(i)}
                                    type="button"
                                    variant="destructive"
                                    size="icon"
                                  >
                                    <SquareX />
                                  </Button>
                                </div>
                                <FieldInfo field={subField} />
                              </>
                            );
                          }}
                        </form.Field>
                      );
                    })}
                    <FieldInfo field={field} />
                    <Button
                      onClick={() => field.pushValue({ id: "" })}
                      disabled={
                        field.state.value.length >= actorsListForSelect.length
                      }
                      type="button"
                      variant="secondary"
                    >
                      Add actor
                    </Button>
                  </div>
                );
              }}
            </form.Field>
          </div>
          <div className="flex flex-col space-y-1.5">
            <form.Field
              name="producerId"
              children={(field) => {
                return (
                  <>
                    <Label htmlFor={field.name}>Producer</Label>
                    <Select
                      onValueChange={field.handleChange}
                      value={field.state.value}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue
                          placeholder="Select a producer"
                          aria-label={field.state.value}
                        >
                          {
                            producerList?.find(
                              (producer) =>
                                producer?.id === Number(field.state.value)
                            )?.name
                          }
                        </SelectValue>
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
          <div className="flex justify-between my-4">
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <>
                  <Button type="submit" disabled={!canSubmit}>
                    {isSubmitting ? "..." : "Submit Movie"}
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
        {mutation.isError ? (
          <div className="text-red-600">{mutation.error.message}</div>
        ) : null}
        {mutation.isSuccess ? (
          <div className="text-green-600">Movie added successfully! 🎉</div>
        ) : null}
      </form>
      <p className="text-sm text-gray-500 my-4">
        Don't see the actor or producer you're looking for? <br />
        Add them here!
      </p>
      <AddActorOrProducerDialog />
    </>
  );
};

export default AddMovie;
