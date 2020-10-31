import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import { Tasks, TaskStatus } from './tasks.model';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
    private tasks: Tasks[] = [];

    getAllTasks(): Tasks[] {
        return this.tasks;
    }

    getTaskById(id: string): Tasks {
        return this.tasks.find(task => task.id === id);
    }

    createTask(createTaskDto: CreateTaskDto): Tasks {
        const { title, description } = createTaskDto;
        const task: Tasks = {
            id: uuidv4(),
            title,
            description,
            status: TaskStatus.OPEN
        }

        this.tasks.push(task);
        return task;
    }

    updateTaskStatusById(id: string, status: TaskStatus): Tasks {
        const task = this.getTaskById(id);
        task.status = status;
        return task;
    }

    deleteTaskById(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id);

        // another alternative
        // const taskIndex = this.tasks.findIndex(task => task.id === id);
        // this.tasks.splice(taskIndex, 1);
    }

}