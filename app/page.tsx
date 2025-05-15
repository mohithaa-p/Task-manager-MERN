import TaskManager from "@/components/task-manager"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Task Manager</h1>
        <TaskManager />
      </div>
    </div>
  )
}
