"use client";

import { useId, useState } from "react";
import { toast } from "sonner";

import { TaskForm, type TaskFormValues } from "@/components/dashboard/TaskForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { MutationResult } from "@/hooks/use-tasks";
import type { CreateTaskPayload, Task } from "@/types/task";

export interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (payload: CreateTaskPayload) => Promise<MutationResult<Task>>;
}

export function CreateTaskDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateTaskDialogProps) {
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);

    // Status is omitted deliberately: the backend hardcodes "Pending" on
    // create and ignores anything sent.
    const result = await onCreate({
      title: values.title,
      description: values.description,
      priority: values.priority,
      due_date: values.due_date === "" ? null : values.due_date,
    });

    setIsSubmitting(false);

    if (result.ok) {
      toast.success("Task created", { description: result.data.title });
      onOpenChange(false);
      return;
    }

    // Stay open on failure so the typed input is not thrown away.
    toast.error("Could not create task", { description: result.error });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        // Ignore dismiss attempts mid-request; the result handler closes it.
        if (isSubmitting && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>
            Add a task to your workspace. It starts as Pending — you can change
            the status once it exists.
          </DialogDescription>
        </DialogHeader>

        {/* Remounted per open via `key` so a cancelled draft does not reappear
         * the next time the dialog is opened. */}
        <TaskForm
          key={open ? "open" : "closed"}
          formId={formId}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" disabled={isSubmitting} />}
          >
            Cancel
          </DialogClose>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? "Creating…" : "Create task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
