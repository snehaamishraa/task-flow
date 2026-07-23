"use client";

import { useId, useState, type FormEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toDateInputValue } from "@/services/task-service";
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  isTaskPriority,
  isTaskStatus,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "@/types/task";

/** Mirrors the DB column, which is `varchar` with no length cap in practice. */
const TITLE_MAX_LENGTH = 200;
const DESCRIPTION_MAX_LENGTH = 2000;

/**
 * Every editable field, in the shape the inputs use.
 *
 * `due_date` is the raw `YYYY-MM-DD` from `<input type="date">` — conversion to
 * the RFC 3339 the backend requires happens in the task service, so the form
 * never has to know about the wire format.
 */
export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
}

export interface TaskFormProps {
  /** Ties an external submit button to this form via the `form` attribute. */
  formId: string;
  /** Pre-fills the fields when editing. Omit to start blank. */
  task?: Task;
  /**
   * Status is only shown when editing: POST /api/tasks ignores any status sent
   * and hardcodes "Pending", so offering the choice on create would be a lie.
   */
  showStatus?: boolean;
  onSubmit: (values: TaskFormValues) => void;
  /** Disables every field while the request is in flight. */
  isSubmitting?: boolean;
  className?: string;
}

function initialValues(task?: Task): TaskFormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status:
      task && isTaskStatus(task.status) ? task.status : TASK_STATUSES[0],
    priority:
      task && isTaskPriority(task.priority) ? task.priority : "Medium",
    due_date: toDateInputValue(task?.due_date),
  };
}

/**
 * The shared create/edit form.
 *
 * Holds its own field state and validates locally; it does not call the API.
 * The parent dialog decides what to do with the submitted values, so one form
 * serves both create and edit without branching on mode internally.
 */
export function TaskForm({
  formId,
  task,
  showStatus = false,
  onSubmit,
  isSubmitting = false,
  className,
}: TaskFormProps) {
  const fieldId = useId();
  const [values, setValues] = useState<TaskFormValues>(() =>
    initialValues(task),
  );
  const [titleError, setTitleError] = useState<string | null>(null);

  const titleInputId = `${fieldId}-title`;
  const titleErrorId = `${fieldId}-title-error`;
  const descriptionId = `${fieldId}-description`;
  const dueDateId = `${fieldId}-due-date`;

  const setField = <K extends keyof TaskFormValues>(
    key: K,
    value: TaskFormValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = values.title.trim();
    if (trimmedTitle === "") {
      // The backend accepts an empty title (no validation on Title), so this
      // guard exists to stop unusable rows being created, not to mirror a
      // server rule.
      setTitleError("Title is required.");
      document.getElementById(titleInputId)?.focus();
      return;
    }

    setTitleError(null);
    onSubmit({
      ...values,
      title: trimmedTitle,
      description: values.description.trim(),
    });
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      noValidate
      className={cn("grid gap-4", className)}
    >
      <div className="grid gap-2">
        <Label htmlFor={titleInputId}>
          Title
          <span aria-hidden="true" className="text-destructive">
            *
          </span>
          <span className="sr-only">(required)</span>
        </Label>
        <Input
          id={titleInputId}
          value={values.title}
          onChange={(event) => {
            setField("title", event.target.value);
            if (titleError) setTitleError(null);
          }}
          maxLength={TITLE_MAX_LENGTH}
          placeholder="e.g. Draft the launch announcement"
          disabled={isSubmitting}
          aria-invalid={titleError !== null}
          aria-describedby={titleError ? titleErrorId : undefined}
          autoFocus
        />
        {titleError ? (
          <p id={titleErrorId} role="alert" className="text-xs text-destructive">
            {titleError}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={descriptionId}>Description</Label>
        <Textarea
          id={descriptionId}
          value={values.description}
          onChange={(event) => setField("description", event.target.value)}
          maxLength={DESCRIPTION_MAX_LENGTH}
          placeholder="Add any detail worth remembering later."
          disabled={isSubmitting}
          className="min-h-24 resize-none"
        />
      </div>

      <div className={cn("grid gap-4", showStatus ? "sm:grid-cols-2" : null)}>
        <div className="grid gap-2">
          <Label htmlFor={`${fieldId}-priority`}>Priority</Label>
          <Select
            value={values.priority}
            onValueChange={(value) =>
              setField("priority", String(value) as TaskPriority)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger id={`${fieldId}-priority`} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TASK_PRIORITIES.map((priority) => (
                <SelectItem key={priority} value={priority}>
                  {priority}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showStatus ? (
          <div className="grid gap-2">
            <Label htmlFor={`${fieldId}-status`}>Status</Label>
            <Select
              value={values.status}
              onValueChange={(value) =>
                setField("status", String(value) as TaskStatus)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger id={`${fieldId}-status`} className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor={dueDateId}>Due date</Label>
        <Input
          id={dueDateId}
          type="date"
          value={values.due_date}
          onChange={(event) => setField("due_date", event.target.value)}
          disabled={isSubmitting}
          className="h-9 w-full"
        />
        <p className="text-xs text-muted-foreground">
          Optional. Leave empty for no deadline.
        </p>
      </div>
    </form>
  );
}
