import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task.status.enum';
import { User } from '../auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');

    constructor(private tasksService: TasksService) { }

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User
    ) {
        this.logger.verbose(`User ${user.username} retrieving all tasks. 
        Filters: ${JSON.stringify(filterDto)}`)

        return this.tasksService.getTasks(filterDto, user);
    }

    @Get(':id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.tasksService.getTaskById(id, user);
    }

    /** Using DTO(Data Transfer Object) concept */
    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User
    ) {
        this.logger.verbose(`User ${user.username} creating a new task.
         Data: ${JSON.stringify(createTaskDto)}`);

        return this.tasksService.createTask(createTaskDto, user);
    }

    @Patch(':id/status')
    updateTaskStatusById(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User
    ) {
        return this.tasksService.updateTaskStatusById(id, status, user);
    }

    @Delete(':id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User
    ) {
        return this.tasksService.deleteTaskById(id, user);
    }

}
