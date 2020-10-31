import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(filterDto: GetTasksFilterDto) {
        return this.taskRepository.getTasks(filterDto);
    }

    async getTaskById(id: number): Promise<Task> {
        const taskFounded = await this.taskRepository.findOne(id);
        if (!taskFounded) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return taskFounded;
    }

    async createTask(createTaskDto: CreateTaskDto) {
        return this.taskRepository.createTask(createTaskDto);
    }

    async updateTaskStatusById(id: number, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTaskById(id: number): Promise<void> {
        const deleteResult = await this.taskRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

}
