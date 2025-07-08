import { Application } from 'express';
import { IDIContainer } from 'rsdi';
import TaskController from '../controllers/TaskController';


export default function (app: Application, diContainer: IDIContainer): void {
  const taskController = diContainer.get(TaskController)

  app.route('/')
    .get(taskController.getTasksDashboard.bind(taskController))
  app.route('/tasks/create')
    .get(taskController.getCreateTaskPage.bind(taskController))
    .post(taskController.postCreateTaskPage.bind(taskController))
  app.route('/tasks/:id')
    .get(taskController.getTaskPage.bind(taskController))
    .post(taskController.postTaskPage.bind(taskController))
  app.route('/tasks/:id/delete')
    .get(taskController.deleteTaskPage.bind(taskController))
}
