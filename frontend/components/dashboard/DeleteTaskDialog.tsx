"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import type { MutationResult } from "@/hooks/use-tasks";
import type { Task } from "@/types/task";

export interface DeleteTaskDialogProps {
  /** The task pending deletion. Null closes the dialog. */
  task: Task | null;
  onOpenChange: (open: boolean) => void;
  onDelete: (task: Task) => Promise<MutationResult<null>>;
}

/**
 * Destructive confirmation for DELETE /api/tasks/:id.
 *
 * An AlertDialog rather than a Dialog: it is a decision that cannot be undone,
 * so it takes focus and cannot be dismissed by clicking away.
 */
export function DeleteTaskDialog({
  task,
  onOpenChange,
  onDelete,
}: DeleteTaskDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!task) return;

    setIsDeleting(true);
    const result = await onDelete(task);
    setIsDeleting(false);

    if (result.ok) {
      toast.success("Task deleted", { description: task.title });
      onOpenChange(false);
      return;
    }

    // Stays open on failure so the user can retry without hunting for the row
    // again.
    toast.error("Could not delete task", { description: result.error });
  };

  return (
    <AlertDialog
      open={task !== null}
      onOpenChange={(nextOpen) => {
        if (isDeleting && !nextOpen) return;
        onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent>
        <AlertDialogMedia className="bg-destructive/10 text-destructive">
          <Trash2 aria-hidden="true" />
        </AlertDialogMedia>

        <AlertDialogHeader>
          <AlertDialogTitle>Delete this task?</AlertDialogTitle>
          <AlertDialogDescription>
            {task
              ? `"${task.title}" will be removed. This cannot be undone.`
              : null}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            render={<Button variant="outline" disabled={isDeleting} />}
          >
            Cancel
          </AlertDialogCancel>

          {/* Not AlertDialogAction: that closes on click, which would hide the
           * dialog before the request resolves and lose the failure path. */}
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 aria-hidden="true" />
            {isDeleting ? "Deleting…" : "Delete task"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
