import { DIContainer } from "rsdi";
import { ApiClient } from "clients/ApiClient";
import TaskController from "controllers/TaskController";

console.log('=============DIContainer', DIContainer)
export type AppDIContainer = ReturnType<typeof configureDI>;

export function configureDI() {
  return new DIContainer()
    .add("apiClient", () => new ApiClient())
    // .add("taskController", ({ apiClient }) => new TaskController(apiClient))
    .add("taskController", ({ apiClient }: { apiClient: ApiClient }) => new TaskController(apiClient))

}
