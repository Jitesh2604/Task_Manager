"use client";

import { Plus, Pencil, Trash2, Edit, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// import { Switch } from "@/components/ui/switch";
import { LogOut, List, LayoutGrid } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { TASK_STATUS } from '@/lib/utils';

const priorityColors = {
  Low: "bg-blue-100 text-blue-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800"
};

const statusColors = {
  Todo: "bg-gray-100 text-gray-800",
  "In Progress": "bg-purple-100 text-purple-800",
  Completed: "bg-green-100 text-green-800"
};

export default function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [accessToken, setAccessToken ] = useState()
  const router = useRouter()
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [todo, setTodo] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [newTask, setNewTask] = useState({
      title: "",
      description: "",
      priority: "Medium",
      status: "To Do",
    });
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [filters, setFilters] = useState({status: "All", priority: "All"})

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = JSON.parse(sessionStorage.getItem("token"));
      if (storedToken) {
        setAccessToken(storedToken);
        getData(storedToken);
      }
    }
    }, []);

    const getData = async (token) => {
      try {
        const response = await fetch("http://localhost:8080/api/tasks", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        const data = await response.json();
        console.log(data);

        setTasks(data);
        setFilteredTasks(data)
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    const addTask = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newTask),
        });
  
        if (response.ok) {
          const addedTask = await response.json();
          setTasks((prevTasks) => [...prevTasks, addedTask]);
          if (addedTask.status === "To Do") {
            setTodo((prev) => [...prev, addedTask]);
          } else if (addedTask.status === "In Progress") {
            setInProgress((prev) => [...prev, addedTask]);
          } else if (addedTask.status === "Completed") {
            setCompleted((prev) => [...prev, addedTask]);
          }
          setNewTask({
            title: "",
            description: "",
            priority: "Medium",
            status: "To Do",
          });
          setIsAddingTask(false);
        } else {
          throw new Error("Failed to add task");
        }
      } catch (err) {
        console.error("Error adding task:", err);
      }
    };

    const updateTask = async (taskId, updatedTask) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/tasks/${taskId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedTask),
          }
        );
  
        if (response.ok) {
          const newTask = await response.json();
          setTasks((prevTasks) =>
            prevTasks.map((task) => (task._id === taskId ? newTask : task))
          );
          setCompleted((prev) =>
            prev.map((task) => (task._id === taskId ? newTask : task))
          );
          setInProgress((prev) =>
            prev.map((task) => (task._id === taskId ? newTask : task))
          );
          setTodo((prev) =>
            prev.map((task) => (task._id === taskId ? newTask : task))
          );
          setEditingTask(null);
        } else {
          throw new Error("Failed to update task");
        }
      } catch (err) {
        console.error("Error updating task:", err);
      }
    };

    const deleteTask = async (taskId) => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/tasks/${taskId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
          setCompleted((prev) => prev.filter((task) => task._id !== taskId));
          setInProgress((prev) => prev.filter((task) => task._id !== taskId));
          setTodo((prev) => prev.filter((task) => task._id !== taskId));
        } else {
          throw new Error("Failed to delete task");
        }
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    };

    const handleEditTask = (task) => {
      setEditingTask({ ...task });
    };
  
    const handleUpdateTask = () => {
      if (editingTask) {
        updateTask(editingTask._id, editingTask);
      }
    };

    // Sorting Function
    const sortTasks = (criterion) => {
      const sortedTasks = [...tasks];
      if (criterion === "title") {
        sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
      } else if (criterion === "priority") {
        const priorityOrder = ["Low", "Medium", "High"];
        sortedTasks.sort((a, b) => priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority));
      } else if (criterion === "status") {
        const statusOrder = ["To Do", "In Progress", "Completed"];
        sortedTasks.sort((a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status));
      }
      setTasks(sortedTasks);
    };

    const handleSortChange = (value) => {
      setSortCriterion(value);
      sortTasks(value);
    };

    const handleLogout = () => {
      sessionStorage.removeItem("token");
      setAccessToken(null);
      router.push("/Signin");
    };

    const handleKanban = () => {
      router.push("/KanbanBoard")
    }

    const selectStatus = (val) => {
      setFilters({...filters, status: val})
      // filterTasks("status", val)
    }
    // const filterTasks = (filterType, filterVal) => {
    //   // if (filterVal == "All") 
    //   const filteredTasks = tasks.filter((task) => task[filterType] == filterVal)
    //   setFilteredTasks(filteredTasks)
    // }
    const selectPriority = (val) => {
      setFilters({...filters, priority: val})
      // filterTasks("priority", val)
    }

  useEffect(()=>{
    const filteredTasks = tasks.filter(task => {
      const statusMatches = filters.status === 'All' || task.status === filters.status;
      const priorityMatches = filters.priority === 'All' || task.priority === filters.priority;
      return statusMatches && priorityMatches;
    })
    setFilteredTasks(filteredTasks)
  },[filters])

  return (<div className="min-h-screen bg-gray-900 text-white p-8">
    <div className="flex justify-between items-center mb-8 mt-9">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <div className="flex items-center space-x-4">
          <Button variant="destructive" className="text-white border-gray-700" onClick={handleKanban}>Kanban Board</Button>
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
    <Card className="w-full max-w-4xl mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Task List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            
            <Select onValueChange={selectStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value={TASK_STATUS.todos}>Todo</SelectItem>
                <SelectItem value={TASK_STATUS.inprogress}>In Progress</SelectItem>
                <SelectItem value={TASK_STATUS.completed}>Completed</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={selectPriority}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priorities</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant={true}  onClick={() => setIsAddingTask(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>
          <Dialog>
          <ul className="space-y-4">
            {filteredTasks.map((task) => (
              <li key={task._id} className="border rounded-lg p-4 shadow-sm">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <div className="flex space-x-2">
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex justify-end space-x-2 mt-2">
                  <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleEditTask(task)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogDescription>
                  Make changes to your task here. Click save when you are done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={editingTask?.title || ""}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={editingTask?.description || ""}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        description: e.target.value,
                      })
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="priority" className="text-right">
                    Priority
                  </Label>
                  <Select
                    value={editingTask?.priority || ""}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, priority: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={editingTask?.status || ""}
                    onValueChange={(value) =>
                      setEditingTask({ ...editingTask, status: value })
                    }
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="To Do">To Do</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleUpdateTask}>
                  Save changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => deleteTask(task._id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          </Dialog>
        </div> 
      </CardContent>
    </Card>

    <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new task.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Task title"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Task description"
              />
            </div>
            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newTask.priority}
                onValueChange={(value) =>
                  setNewTask((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTask.status}
                onValueChange={(value) =>
                  setNewTask((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button
            onClick={addTask}
            type="submit"
            disabled={!newTask.title || !newTask.description}
          >
            Add Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the fields below to edit the task.
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">Title</Label>
              <Input
                id="edit-title"
                value={editingTask?.title || ""}
                onChange={(e) =>
                  setEditingTask((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Task title"
              />
            </div>
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                value={editingTask?.description || ""}
                onChange={(e) =>
                  setEditingTask((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Task description"
              />
            </div>
            <div>
              <Label htmlFor="edit-priority">Priority</Label>
              <Select
                value={editingTask?.priority || "Medium"}
                onValueChange={(value) =>
                  setEditingTask((prev) => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="edit-status">Status</Label>
              <Select
                value={editingTask?.status || "To Do"}
                onValueChange={(value) =>
                  setEditingTask((prev) => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="To Do">To Do</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button onClick={handleUpdateTask} type="submit">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>);
}
