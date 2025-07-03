import { Application } from 'express';
import axios from 'axios';


export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      res.render('home', { "tasks": response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

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
