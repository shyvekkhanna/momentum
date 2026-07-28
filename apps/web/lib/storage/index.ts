import { createShoppingRepository, createTaskRepository } from "@momentum/storage";
import { webStorageDriver } from "./webStorageDriver";

export const taskRepository = createTaskRepository(webStorageDriver);
export const shoppingRepository = createShoppingRepository(webStorageDriver);
