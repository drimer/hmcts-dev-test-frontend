import 'jest'
import { Request, Response } from 'express'
import TaskController from '../../../main/controllers/TaskController'
import { ApiClient, Task } from '../../../main/clients/ApiClient'
import { mockRequest, mockResponse } from '../../mocks'

// Mock the ApiClient module
jest.mock('../../../main/clients/ApiClient')

const mockedApiClient = ApiClient as jest.MockedClass<typeof ApiClient>

describe('TaskController', () => {
  let taskController: TaskController
  let apiClient: jest.Mocked<ApiClient>
  let req: Partial<Request>
  let res: Partial<Response>

  beforeEach(() => {
    // Create a new mock instance for each test
    apiClient = new mockedApiClient() as jest.Mocked<ApiClient>
    taskController = new TaskController(apiClient)
    req = mockRequest()
    res = mockResponse()
    // Suppress console.error output in tests
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('getTasksDashboard', () => {
    it('should render the home page with tasks on success', async () => {
      const tasks = [new Task(1, 'Test Task', 'A description', 'PENDING')]
      apiClient.getAllTasks.mockResolvedValue(
        new Promise((resolve) => resolve(tasks))
      )

      await taskController.getTasksDashboard(req as Request, res as Response)

      expect(apiClient.getAllTasks).toHaveBeenCalledTimes(1)
      expect(res.render).toHaveBeenCalledWith('home', { tasks: tasks })
    })

    it('should render the home page without tasks on API error', async () => {
      const error = new Error('API Error')
      apiClient.getAllTasks.mockRejectedValue(error)

      await taskController.getTasksDashboard(req as Request, res as Response)

      expect(apiClient.getAllTasks).toHaveBeenCalledTimes(1)
      expect(console.error).toHaveBeenCalledWith('Error making request:', error)
      expect(res.render).toHaveBeenCalledWith('home', {})
    })
  })

  describe('getCreateTaskPage', () => {
    it('should render the create-task page', async () => {
      await taskController.getCreateTaskPage(req as Request, res as Response)
      expect(res.render).toHaveBeenCalledWith('create-task')
    })
  })

  describe('postCreateTaskPage', () => {
    beforeEach(() => {
      req.body = {
        title: 'New Task',
        description: 'A description',
        status: 'PENDING',
      }
    })

    it('should create a task and redirect to home on success', async () => {
      apiClient.createTask.mockResolvedValue(
        new Promise((resolve) => resolve(
          new Task(1, 'New Task', 'A description', 'PENDING')
        )))

      await taskController.postCreateTaskPage(req as Request, res as Response)

      expect(apiClient.createTask).toHaveBeenCalledWith('New Task', 'A description', 'PENDING')
      expect(res.redirect).toHaveBeenCalledWith('/')
    })

    it('should re-render create-task page with errors and original data on failure', async () => {
      const errors = { title: 'Title is required' }
      const error = { response: { data: errors } }
      apiClient.createTask.mockRejectedValue(error)

      await taskController.postCreateTaskPage(req as Request, res as Response)

      expect(apiClient.createTask).toHaveBeenCalledWith('New Task', 'A description', 'PENDING')
      expect(res.redirect).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith('create-task', {
        title: 'New Task',
        description: 'A description',
        status: 'PENDING',
        errors: errors,
      })
    })
  })

  describe('getTaskPage', () => {
    beforeEach(() => {
      req.params = { id: '1' }
    })

    it('should render the task page with a task on success', async () => {
      const task = new Task(1, 'Test Task', 'A description', 'PENDING')
      apiClient.getTask.mockResolvedValue(
        new Promise((resolve) => resolve(
          task
        ))
      )

      await taskController.getTaskPage(req as Request, res as Response)

      expect(apiClient.getTask).toHaveBeenCalledWith('1')
      expect(res.render).toHaveBeenCalledWith('task', { task: task })
    })

    it('should render the home page on API error', async () => {
      const error = new Error('API Error')
      apiClient.getTask.mockRejectedValue(error)

      await taskController.getTaskPage(req as Request, res as Response)

      expect(apiClient.getTask).toHaveBeenCalledWith('1')
      expect(console.error).toHaveBeenCalledWith('Error making request:', error)
      expect(res.render).toHaveBeenCalledWith('home', {})
    })
  })

  describe('postTaskPage', () => {
    beforeEach(() => {
      req.params = { id: '1' }
      req.body = { status: 'DONE' }
    })

    it('should update a task and redirect to home on success', async () => {
      apiClient.updateTask.mockResolvedValue(
        new Promise((resolve) => resolve(
          new Task(1, 'Test Task', 'A description', 'PENDING')
        ))
      )

      await taskController.postTaskPage(req as Request, res as Response)

      expect(apiClient.updateTask).toHaveBeenCalledWith('1', 'DONE')
      expect(res.redirect).toHaveBeenCalledWith('/')
    })

    it('should re-render task page with errors on failure', async () => {
      const task = new Task(1, 'Test Task', 'A description', 'PENDING')
      const errors = { status: 'Invalid status' }
      const error = { response: { data: errors } }
      apiClient.updateTask.mockRejectedValue(error)
      apiClient.getTask.mockResolvedValue(task)

      await taskController.postTaskPage(req as Request, res as Response)

      expect(apiClient.updateTask).toHaveBeenCalledWith('1', 'DONE')
      expect(apiClient.getTask).toHaveBeenCalledWith('1')
      expect(res.redirect).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith('task', {
        task: task,
        errors: errors,
      })
    })
  })

  describe('deleteTaskPage', () => {
    beforeEach(() => {
      req.params = { id: '1' }
    })

    it('should delete a task and redirect to home on success', async () => {
      apiClient.deleteTask.mockResolvedValue(undefined)

      await taskController.deleteTaskPage(req as Request, res as Response)

      expect(apiClient.deleteTask).toHaveBeenCalledWith('1')
      expect(res.redirect).toHaveBeenCalledWith('/')
    })

    it('should render home page with errors on failure', async () => {
      const task = new Task(1, 'Test Task', 'A description', 'PENDING')
      const errors = { message: 'Cannot delete' }
      const error = { response: { data: errors } }
      apiClient.deleteTask.mockRejectedValue(error)
      apiClient.getTask.mockResolvedValue(task)

      await taskController.deleteTaskPage(req as Request, res as Response)

      expect(apiClient.deleteTask).toHaveBeenCalledWith('1')
      expect(apiClient.getTask).toHaveBeenCalledWith('1')
      expect(res.redirect).not.toHaveBeenCalled()
      expect(res.render).toHaveBeenCalledWith('home', {
        tasks: task,
        errors: errors,
      })
    })
  })
})
