"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import TaskColumn from "@/components/custom/TasksColumn";
import TasksContent from "@/components/custom/TasksContent";
import { TASK_STATUS } from "@/lib/utils";

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [accessTokenObj, setAccessTokenObj] = useState(null);
  const router = useRouter();

  // Fetch token and tasks on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = sessionStorage.getItem("token");
      if (storedToken) {
        setAccessTokenObj(JSON.parse(storedToken));
      }
    }
  }, []);

  useEffect(() => {
    const getData = async () => {
      if (!accessTokenObj) return;

      try {
        const response = await fetch("http://localhost:8080/api/tasks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessTokenObj}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        setTasks(data);
        setCompleted(data.filter((task) => task.status === "Completed"));
        setInProgress(data.filter((task) => task.status === "In Progress"));
        setTodo(data.filter((task) => task.status === "To Do"));
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    getData();
  }, [accessTokenObj]);

  // Drag and Drop Handler
  const onDragEnd = (result) => {
    console.log(result, "result");
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceList = getList(source.droppableId);
      const destinationList = getList(destination.droppableId);
      const [movedTask] = sourceList.splice(source.index, 1);
      movedTask.status = getStatus(destination.droppableId);
      destinationList.splice(destination.index, 0, movedTask);

      // Update task in the database
      updateTask(movedTask._id, movedTask);
    } else {
      const list = getList(source.droppableId);
      const [movedTask] = list.splice(source.index, 1);
      list.splice(destination.index, 0, movedTask);
    }

    setTodo([...todo]);
    setInProgress([...inProgress]);
    setCompleted([...completed]);
  };

  // Get the list of tasks based on droppableId
  const getList = (id) => {
    if (id === TASK_STATUS.todos) return todo;
    if (id === TASK_STATUS.inprogress) return inProgress;
    if (id === TASK_STATUS.completed) return completed;
  };

  // Get the status based on droppableId
  const getStatus = (id) => {
    if (id === TASK_STATUS.todos) return TASK_STATUS.todos;
    if (id === TASK_STATUS.inprogress) return TASK_STATUS.inprogress;
    if (id === TASK_STATUS.completed) return TASK_STATUS.completed;
  };

  // Update task on the server
  const updateTask = async (taskId, updatedTask) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/tasks/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessTokenObj}`,
          },
          body: JSON.stringify(updatedTask),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    sessionStorage.removeItem("token");
    setAccessTokenObj(null);
    router.push("/Signin");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="destructive"
            className="text-white border-gray-700"
            onClick={() => router.push("/TaskList")}
          >
            Task List
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <TasksContent todo={todo} inProgress={inProgress} completed={completed}/>
      </DragDropContext>
    </div>
  );
}
