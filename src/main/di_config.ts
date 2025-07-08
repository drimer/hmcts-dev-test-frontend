import DIContainer, { factory, object, use } from "rsdi";
import { ApiClient } from "./clients/ApiClient";
import TaskController from "./controllers/TaskController";

export type AppDIContainer = ReturnType<typeof configureDI>;

export function configureDI() {
  const container: DIContainer = new DIContainer();
  container.add({
    [ApiClient.name]: factory(() => {
      return new ApiClient()
    }),
    [TaskController.name]: object(TaskController).construct(
      use(ApiClient.name)
    ),
  })

  return container;
}
