import axios from 'axios';


export class Task {
  id: number
  title: string
  description: string
  status: string

  constructor(id: number, title: string, description: string, status: string) {
    this.id = id
    this.title = title
    this.description = description
    this.status = status
  }
}


export class ApiClient {

  protected baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:4000') {
    this.baseUrl = baseUrl
  }

  async getAllTasks(): Promise<Task> {
    const response = await axios.get(`${this.baseUrl}/tasks`)
    return response.data.map(
      (task: any) =>
        new Task(task.id, task.title, task.description, task.status)
    )
  }

  async createTask(title: string, description: string, status: string): Promise<Task> {
    const response = await axios.post(`${this.baseUrl}/tasks`, { title, description, status })
    return response.data　as Task
  }

  async getTask(id: string): Promise<Task> {
    const response = await axios.get(`${this.baseUrl}/tasks/${id}`)
    return response.data　as Task
  }

  async updateTask(id: string, status: string): Promise<Task> {
    const response = await axios.patch(`${this.baseUrl}/tasks/${id}`, { status })
    return response.data　as Task
  }

  async deleteTask(id: string) {
    await axios.delete(`${this.baseUrl}/tasks/${id}`)
  }

}
