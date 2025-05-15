"use client"

import { useState, useEffect } from "react"
import { PlusCircle } from "lucide-react"
import TaskForm from "./task-form"
import TaskList from "./task-list"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Task } from "@/lib/types"

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/tasks")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddTask = async (task: Omit<Task, "_id">) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      })

      if (response.ok) {
        const newTask = await response.json()
        setTasks([...tasks, newTask])
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error("Error adding task:", error)
    }
  }

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`/api/tasks/${updatedTask._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })

      if (response.ok) {
        setTasks(tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task)))
        setTaskToEdit(null)
        setIsFormOpen(false)
      }
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== id))
      }
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    const taskToToggle = tasks.find((task) => task._id === id)
    if (!taskToToggle) return

    const updatedTask = { ...taskToToggle, completed }
    await handleUpdateTask(updatedTask)
  }

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task)
    setIsFormOpen(true)
  }

  const completedTasks = tasks.filter((task) => task.completed)
  const pendingTasks = tasks.filter((task) => !task.completed)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">My Tasks</h2>
        <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Add Task
        </Button>
      </div>

      {isFormOpen && (
        <TaskForm
          onSubmit={taskToEdit ? handleUpdateTask : handleAddTask}
          onCancel={() => {
            setIsFormOpen(false)
            setTaskToEdit(null)
          }}
          initialData={taskToEdit}
        />
      )}

      <Tabs defaultValue="all" className="mt-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onToggleComplete={handleToggleComplete}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="pending">
          <TaskList
            tasks={pendingTasks}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onToggleComplete={handleToggleComplete}
            isLoading={isLoading}
          />
        </TabsContent>
        <TabsContent value="completed">
          <TaskList
            tasks={completedTasks}
            onDelete={handleDeleteTask}
            onEdit={handleEditTask}
            onToggleComplete={handleToggleComplete}
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
