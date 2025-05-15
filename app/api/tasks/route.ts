import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("taskmanager")

    const tasks = await db.collection("tasks").find({}).sort({ createdAt: -1 }).toArray()

    // Convert MongoDB _id to string
    const tasksWithStringId = tasks.map((task) => ({
      ...task,
      _id: task._id.toString(),
    }))

    return NextResponse.json(tasksWithStringId)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("taskmanager")

    const task = await request.json()

    // Add createdAt timestamp
    const taskWithTimestamp = {
      ...task,
      createdAt: new Date().toISOString(),
    }

    const result = await db.collection("tasks").insertOne(taskWithTimestamp)

    // Return the created task with string _id
    return NextResponse.json({
      ...taskWithTimestamp,
      _id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}
