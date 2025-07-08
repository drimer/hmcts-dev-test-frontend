import { Request, Response } from 'express'
import { ApiClient } from '../clients/ApiClient';


export default class TaskController {

  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async getTasksDashboard(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.apiClient.getAllTasks();
      res.render('home', { "tasks": tasks });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  }

  public async getCreateTaskPage(req: Request, res: Response): Promise<void> {
    res.render('create-task');
  }

  public async postCreateTaskPage(req: Request, res: Response): Promise<void> {
    try {
      await this.apiClient.createTask(
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
  }

  public async getTaskPage(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.apiClient.getTask(req.params.id);
      res.render('task', { "task": task });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  }

  public async postTaskPage(req: Request, res: Response): Promise<void> {
    try {
      await this.apiClient.updateTask(
        req.params.id,
        req.body.status
      );
      res.redirect(`/`);
    } catch (error) {
        const task = await this.apiClient.getTask(req.params.id);
        res.render('task', { "task": task, "errors": error.response.data });
    }
  }

  public async deleteTaskPage(req: Request, res: Response): Promise<void> {
    try {
      await this.apiClient.deleteTask(req.params.id)

      res.redirect(`/`);
    } catch (error) {
      const task = await this.apiClient.getTask(req.params.id);
      res.render('home', { "tasks": task, "errors": error.response.data });
    }
  }

}
