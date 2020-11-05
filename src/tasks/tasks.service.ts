import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TaskStatus } from './task.status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository
    ) { }

    async getTasks(filterDto: GetTasksFilterDto, user: User) {
        return this.taskRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: number, user: User): Promise<Task> {
        const taskFounded = await this.taskRepository
            .findOne({ where: { id, userId: user.id } });
        if (!taskFounded) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return taskFounded;
    }

    async createTask(createTaskDto: CreateTaskDto, user: User) {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async updateTaskStatusById(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }

    async deleteTaskById(id: number, user: User): Promise<void> {
        const deleteResult = await this.taskRepository.delete({ id, userId: user.id });
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }

}
