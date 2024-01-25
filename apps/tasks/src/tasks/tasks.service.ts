import { Injectable, Logger } from '@nestjs/common';
import { RpcException } from "@nestjs/microservices";
import { status } from "@grpc/grpc-js";
import { Task } from "./interfaces/task.interface";

const logger = new Logger('Tasks Microservice');

@Injectable()
export class TasksService {
    private readonly mockTasks: Task[] = [
        { id: 1, name: 'Task #1', assignedUser: 2 },
        { id: 2, name: 'Task #2', assignedUser: 1 },
        { id: 3, name: 'Task #3', assignedUser: 1 },
    ];

    private checkLength(length: number): boolean {
        if (!length) {
            const errorMessage: string = 'No tasks found!';
            logger.error(errorMessage);

            throw new RpcException({
                code: status.NOT_FOUND,
                message: errorMessage,
            });
        }

        return true;
    }

    private validateTask(task: Task): boolean {
        if (!(task.id && task.name && task.assignedUser)) {
            const errorMessage: string = 'The Task argument must contain all the fields!';
            logger.error(errorMessage);

            throw new RpcException({
                code: status.INVALID_ARGUMENT,
                message: errorMessage,
            });
        }

        return true;
    }

    private async getTaskIndex(id: number): Promise<number> {
        return this.mockTasks.findIndex(task => task.id === id);
    }

    private async getTaskIndexAndCheckIsFound(id: number): Promise<number> {
        const taskIndex = await this.getTaskIndex(id);

        if (taskIndex === -1) {
            const errorMessage: string = `Task with ID: ${id} not found!`;
            logger.error(errorMessage);

            throw new RpcException({
                code: status.NOT_FOUND,
                message: errorMessage,
            });
        }

        return taskIndex;
    }

    private async getTaskIndexAndCheckIsExist(id: number): Promise<number> {
        const taskIndex = await this.getTaskIndex(id);

        if (taskIndex !== -1) {
            const errorMessage: string = `Task with ID: ${id} already exists!`;
            logger.error(errorMessage);

            throw new RpcException({
                code: status.ALREADY_EXISTS,
                message: errorMessage,
            });
        }

        return taskIndex;
    }

    public async getTasks(): Promise<Task[]> {
        logger.log('Find method was called');

        const tasks = this.mockTasks;
        this.checkLength(tasks.length);

        logger.log('All available tasks were fetched');

        return tasks;
    }

    public async getTaskById(id: number): Promise<Task> {
        logger.log('FindOne method was called');

        const taskIndex = await this.getTaskIndexAndCheckIsFound(id);

        logger.log(`Task with ID: ${id} was fetched`);

        return this.mockTasks[taskIndex];
    }

    public async createTask(task: Task): Promise<boolean> {
        logger.log('Create method was called');

        this.validateTask(task);
        await this.getTaskIndexAndCheckIsExist(task.id);
        this.mockTasks.push(task);

        logger.log(`Task with ID: ${task.id} was created`);

        return true;
    }

    public async updateTask(task: Task): Promise<boolean> {
        logger.log('Update method was called');

        this.validateTask(task);
        const taskIndex = await this.getTaskIndexAndCheckIsFound(task.id);
        this.mockTasks[taskIndex] = task;

        logger.log(`Task with ID: ${task.id} was updated`);

        return true;
    }

    public async deleteTask(id: number): Promise<boolean> {
        logger.log('Delete method was called');

        const taskIndex = await this.getTaskIndexAndCheckIsFound(id);
        this.mockTasks.splice(taskIndex, 1);

        logger.log(`Task with ID: ${id} was deleted`);

        return true;
    }
}
