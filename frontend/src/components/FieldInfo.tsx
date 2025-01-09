import type { FieldApi } from "@tanstack/react-form";
import { cn } from "@/lib/utils";

export default function FieldInfo({
  field,
  className,
}: {
  field: FieldApi<any, any, any, any>; // eslint-disable-line
  className?: string;
}) {
  return (
    <>
      {field.state.meta.isTouched && field.state.meta.errors.length ? (
        <em className={cn("text-red-600", className)}>
          {field.state.meta.errors.join(",")}
        </em>
      ) : null}
    </>
  );
}
