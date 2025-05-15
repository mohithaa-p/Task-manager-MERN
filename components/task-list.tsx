"use client"

import { Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import type { Task } from "@/lib/types"
import { Skeleton } from "@/components/ui/skeleton"

interface TaskListProps {
  tasks: Task[]
  onDelete: (id: string) => void
  onEdit: (task: Task) => void
  onToggleComplete: (id: string, completed: boolean) => void
  isLoading: boolean
}

export default function TaskList({ tasks, onDelete, onEdit, onToggleComplete, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4 mt-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-8 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (tasks.length === 0) {
    return <div className="text-center py-8 text-gray-500">No tasks found. Click "Add Task" to create one.</div>
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {tasks.map((task) => (
        <Card key={task._id} className={`border ${task.completed ? "bg-gray-50" : ""}`}>
          <CardHeader className="pb-2 flex flex-row items-start justify-between">
            <div className="flex items-start gap-2">
              <Checkbox
                checked={task.completed}
                onCheckedChange={(checked) => {
                  onToggleComplete(task._id, checked as boolean)
                }}
                className="mt-1"
              />
              <div>
                <h3 className={`font-medium text-lg ${task.completed ? "line-through text-gray-500" : ""}`}>
                  {task.title}
                </h3>
                {task.dueDate && (
                  <p className="text-sm text-gray-500 mt-1">Due: {format(new Date(task.dueDate), "MMM d, yyyy")}</p>
                )}
              </div>
            </div>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          </CardHeader>

          {task.description && (
            <CardContent className={task.completed ? "text-gray-500" : ""}>
              <p className="text-sm">{task.description}</p>
            </CardContent>
          )}

          <CardFooter className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(task)} className="h-8 px-2">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(task._id)}
              className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
