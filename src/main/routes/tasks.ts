import { Application } from 'express';
import axios from 'axios';
import { ApiClient } from '../clients/ApiClient';


export default function (app: Application): void {

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
      const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);
      res.render('task', { "task": response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.post('/tasks/:id', async (req, res) => {
    try {
      const apiUrl = `http://localhost:4000/tasks/${req.params.id}`;
      const apiTasksPostRequestDto = { status : req.body.status}
      await axios.patch(apiUrl, apiTasksPostRequestDto);

      res.redirect(`/`);
    } catch (error) {
        const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);
        res.render('task', { "task": response.data, "errors": error.response.data });
    }
  });

  app.get('/tasks/:id/delete', async (req, res) => {
    try {
      const apiUrl = `http://localhost:4000/tasks/${req.params.id}`;
      await axios.delete(apiUrl);

      res.redirect(`/`);
    } catch (error) {
      const response = await axios.get('http://localhost:4000/tasks');
      res.render('home', { "tasks": response.data, "errors": error.response.data });
    }
  })

}
