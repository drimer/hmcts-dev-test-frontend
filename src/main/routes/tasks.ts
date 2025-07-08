import { Application } from 'express';
import { ApiClient } from '../clients/ApiClient';
import { AppDIContainer } from '../di_config';


export default function (app: Application, diContainer: AppDIContainer): void {

  const { taskController } = diContainer;

  app.get('/test', taskController.getTasksDashboard)

  app.get('/', async (req, res) => {
    try {
      const apiClient = new ApiClient();
      const tasks = await apiClient.getAllTasks();
      res.render('home', { "tasks": tasks });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.get('/tasks/create', async (req, res) => {
    res.render('create-task');
  })

  app.post('/tasks/create', async (req, res) => {
    try {
      const apiClient = new ApiClient();
      await apiClient.createTask(
        req.body.title,
        req.body.description,
        req.body.status
      );

      res.redirect(`/`);
    } catch (error) {
      res.render('create-task', {
        "title": req.body.title,
        "description": req.body.description,
        "status": req.body.status,
        "errors": error.response.data
      });
    }
  })

  app.get('/tasks/:id', async (req, res) => {
    try {
      const apiClient = new ApiClient();
      const task = await apiClient.getTask(req.params.id);
      res.render('task', { "task": task });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.post('/tasks/:id', async (req, res) => {
    const apiClient = new ApiClient();

    try {
      await apiClient.updateTask(
        req.params.id,
        req.body.status
      );
      res.redirect(`/`);
    } catch (error) {
        const task = await apiClient.getTask(req.params.id);
        res.render('task', { "task": task, "errors": error.response.data });
    }
  });

  app.get('/tasks/:id/delete', async (req, res) => {
    const apiClient = new ApiClient();

    try {
      await apiClient.deleteTask(req.params.id)

      res.redirect(`/`);
    } catch (error) {
      const task = await apiClient.getTask(req.params.id);
      res.render('home', { "tasks": task, "errors": error.response.data });
    }
  })

}
