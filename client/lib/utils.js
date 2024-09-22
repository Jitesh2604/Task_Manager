import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const TASK_STATUS = {
  todos: "To Do",
  completed: "Completed",
  inprogress: "In Progress"
}
