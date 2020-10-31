import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(@Query() filterDto: GetTasksFilterDto) {
        if (Object.keys(filterDto).length) {
            return this.tasksService.getTasksWithFilters(filterDto);
        }
        return this.tasksService.getAllTasks();
    }

    @Get(':id')
    getTaskById(@Param('id') id: string) {
        return this.tasksService.getTaskById(id);
    }

    /** Using DTO(Data Transfer Object) concept */
    @Post()
    createTask(@Body() createTaskDto: CreateTaskDto) {
        return this.tasksService
            .createTask(createTaskDto);
    }

    @Patch(':id/status')
    updateTaskStatusById(
        @Param('id') id: string,
        @Body('status') status: TaskStatus
    ) {
        return this.tasksService.updateTaskStatusById(id, status);
    }

    @Delete(':id')
    deleteTaskById(@Param('id') id: string) {
        this.tasksService.deleteTaskById(id);
    }

    /** Getting the entire body of the request */
    // @Post()
    // createTask(@Body() body) {
    //     console.log('body :>> ', body);
    // }

    /** Getting specific parameters of the request */
    // @Post()
    // createTask(
    //     @Body('title') title: string,
    //     @Body('description') description: string
    // ) {
    //     console.log(title, description);
    // }

}
