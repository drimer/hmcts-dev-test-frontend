import { ApiClient } from '../clients/ApiClient';


export default class TaskController {

  public constructor(
    private readonly apiClient: ApiClient
  ) {}

  public async getTasksDashboard(req: any, res: any): Promise<void> {
    try {
      const tasks = await this.apiClient.getAllTasks();
      res.render('home', { "tasks": tasks });
    } catch (error) {
      console.error('Error making request:', error);
      res.render('home', {});
    }
  }

}
