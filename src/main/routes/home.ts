import { Application } from 'express';
import axios from 'axios';

export default function (app: Application): void {
  app.get('/', async (req, res) => {
    try {
      const response = await axios.get('http://localhost:4000/tasks');
      console.log(response.data);
      res.render('home', { "tasks": response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  });

  app.get('/tasks/:id', async (req, res) => {
    try {
      const response = await axios.get(`http://localhost:4000/tasks/${req.params.id}`);
      console.log(response.data);
      res.render('task', { "task": response.data });
      res.render('task', { "task": response.data });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('task', {});
    }
  });
}
