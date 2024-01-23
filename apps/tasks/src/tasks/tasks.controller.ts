import { Controller } from '@nestjs/common';
import { GrpcMethod } from "@nestjs/microservices";
import { Metadata, ServerUnaryCall } from "@grpc/grpc-js";
import { TasksService } from "./tasks.service";
import { Task } from "./interfaces/task.interface";
import { Tasks } from "./interfaces/tasks.interface";
import { TaskId } from "./interfaces/task-id.interface";
import { Updated } from "./interfaces/updated.interface";

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}

    @GrpcMethod('TasksService', 'Find')
    async find(metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Tasks> {
        return { tasks: await this.tasksService.getTasks() };
    }

    @GrpcMethod('TasksService', 'FindOne')
    async findOne(taskId: TaskId, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Task> {
        return await this.tasksService.getTaskById(taskId.id);
    }

    @GrpcMethod('TasksService', 'Create')
    async create(task: Task, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Updated> {
        return { successful: await this.tasksService.createTask(task) };
    }

    @GrpcMethod('TasksService', 'Update')
    async update(task: Task, metadata: Metadata, call: ServerUnaryCall<any, any>): Promise<Updated> {
        return { successful: await this.tasksService.updateTask(task) };
    }
}
