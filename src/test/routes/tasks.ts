import { ApiClient, Task } from '../../main/clients/ApiClient'

// Mock the ApiClient module. This needs to be done before importing the app.
jest.mock('../../main/clients/ApiClient')

const mockedApiClient = ApiClient as jest.MockedClass<typeof ApiClient>

import { app } from '../../main/app'

import { expect } from 'chai'
import request from 'supertest'

/* eslint-disable jest/expect-expect */
describe('Task routes', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Tasks Dashboard page', () => {
    describe('on GET /', () => {
      test('should return valid page', async () => {
        mockedApiClient.prototype.getAllTasks.mockResolvedValue([])
        await request(app)
          .get('/')
          .expect(res => expect(res.status).to.equal(200))
      })
    })
  })

  describe('Create Task page', () => {
    describe('on GET /tasks/create', () => {
      test('should return create task page', async () => {
        await request(app)
          .get('/tasks/create')
          .expect(res => expect(res.status).to.equal(200))
      })
    })

    describe('on POST /tasks/create', () => {
      test('should redirect to dashboard page on success', async () => {
        mockedApiClient.prototype.createTask.mockResolvedValue(new Task(1, 't', 'd', 's'))

        await request(app)
          .post('/tasks/create')
          .send({ title: 'test', description: 'test desc', status: 'PENDING' })
          .expect(res => {
            expect(res.status).to.equal(302)
            expect(res.header.location).to.equal('/')
          })
      })

      test('should render create task page on failure', async () => {
        const error = { response: { data: { title: 'Error' } } }
        mockedApiClient.prototype.createTask.mockRejectedValue(error)

        await request(app)
          .post('/tasks/create')
          .send({ title: 'test', description: 'test desc', status: 'PENDING' })
          .expect(res => {
            expect(res.status).to.equal(200)
          })
      })
    })
  })

  describe('Task page', () => {
    describe('on GET /tasks/:id', () => {
      test('should return task page', async () => {
        const task = new Task(1, 'Test Task', 'A description', 'PENDING')
        mockedApiClient.prototype.getTask.mockResolvedValue(task)

        await request(app)
          .get('/tasks/1')
          .expect(res => {
            expect(res.status).to.equal(200)
          })
      })
    })

    describe('on POST /tasks/:id', () => {
      test('should redirect to dashboard page on success', async () => {
        mockedApiClient.prototype.updateTask.mockResolvedValue(new Task(1, 't', 'd', 's'))

        await request(app)
          .post('/tasks/1')
          .send({ status: 'DONE' })
          .expect(res => {
            expect(res.status).to.equal(302)
            expect(res.header.location).to.equal('/')
          })
      })
    })
  })

  describe('Delete Task page', () => {
    describe('on GET /tasks/:id/delete', () => {
      test('should redirect to dashboard page on success', async () => {
        mockedApiClient.prototype.deleteTask.mockResolvedValue(undefined)

        await request(app)
          .get('/tasks/1/delete')
          .expect(res => {
            expect(res.status).to.equal(302)
            expect(res.header.location).to.equal('/')
          })
      })
    })
  })
})
