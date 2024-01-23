import { Injectable } from '@nestjs/common';
import { RpcException } from "@nestjs/microservices";
import { status } from "@grpc/grpc-js";
import { Task } from "./interfaces/task.interface";

@Injectable()
export class TasksService {
    private readonly mockTasks: Task[] = [
        { id: 1, name: 'Task #1', assignedUser: 2 },
        { id: 2, name: 'Task #2', assignedUser: 1 },
        { id: 3, name: 'Task #3', assignedUser: 1 },
    ];

    checkTaskType(task: Task): boolean {
        if (!(task.id && task.name && task.assignedUser)) {
            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: 'The Task argument must contain all the fields!',
            });
        }

        return true;
    }

    async getTaskIndex(id: number): Promise<number> {
        return this.mockTasks.findIndex(object => object.id === id);
    }

    async getTasks(): Promise<Task[]> {
        const tasks = this.mockTasks;

        if (!tasks.length) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `No tasks found!`,
            });
        }

        return tasks;
    }

    async getTaskById(id: number): Promise<Task> {
        const task = this.mockTasks.find(object => object.id === id);

        if (!task) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Task with ID: ${id} not found!`,
            });
        }

        return task;
    }

    async createTask(task: Task): Promise<boolean> {
        this.checkTaskType(task);
        let taskIndex = await this.getTaskIndex(task.id);

        if (taskIndex !== -1) {
            throw new RpcException({
                code: status.ALREADY_EXISTS,
                message: `Task with ID: ${task.id} already exists!`,
            });
        }

        this.mockTasks.push(task);

        return true;
    }

    async updateTask(task: Task): Promise<boolean> {
        this.checkTaskType(task);
        let taskIndex = await this.getTaskIndex(task.id);

        if (taskIndex === -1) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Task with ID: ${task.id} not found!`,
            });
        }

        this.mockTasks[taskIndex] = task;

        return true;
    }

    async deleteTask(id: number): Promise<boolean> {
        let taskIndex = await this.getTaskIndex(id);

        if (taskIndex === -1) {
            throw new RpcException({
                code: status.NOT_FOUND,
                message: `Task with ID: ${id} not found!`,
            });
        }

        this.mockTasks.splice(taskIndex, 1);

        return true;
    }
}
