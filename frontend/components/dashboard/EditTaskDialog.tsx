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
import type { Task, UpdateTaskPayload } from "@/types/task";

export interface EditTaskDialogProps {
  /** The task being edited. Null closes the dialog. */
  task: Task | null;
  onOpenChange: (open: boolean) => void;
  onUpdate: (
    task: Task,
    changes: Partial<UpdateTaskPayload>,
  ) => Promise<MutationResult<Task>>;
}

export function EditTaskDialog({
  task,
  onOpenChange,
  onUpdate,
}: EditTaskDialogProps) {
  const formId = useId();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TaskFormValues) => {
    if (!task) return;

    setIsSubmitting(true);

    // All five fields are sent every time. The backend's PUT assigns each
    // column unconditionally, so anything omitted would be blanked.
    const result = await onUpdate(task, {
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      due_date: values.due_date === "" ? null : values.due_date,
    });

    setIsSubmitting(false);

    if (result.ok) {
      toast.success("Task updated", { description: result.data.title });
      onOpenChange(false);
      return;
    }

    // Stay open on failure so the edit is not lost.
    toast.error("Could not update task", { description: result.error });
  };

  return (
    <Dialog
      open={task !== null}
      onOpenChange={(nextOpen) => {
        if (isSubmitting && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit task</DialogTitle>
          <DialogDescription>
            Update the details and save. Every field is sent, so clearing one
            clears it on the task too.
          </DialogDescription>
        </DialogHeader>

        {task ? (
          // Keyed by task id so opening a different task resets the fields
          // instead of showing the previous task's values.
          <TaskForm
            key={task.id}
            formId={formId}
            task={task}
            showStatus
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        ) : null}

        <DialogFooter>
          <DialogClose
            render={<Button variant="outline" disabled={isSubmitting} />}
          >
            Cancel
          </DialogClose>
          <Button type="submit" form={formId} disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
