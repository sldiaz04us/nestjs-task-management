import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task.status.enum';

const mockUser = { id: 12, username: 'Test user' };

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository }
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get(TaskRepository);
    });

    describe('getTasks', () => {
        it('get all tasks from the repository', async () => {
            // taskRepository.getTasks.mockReturnValue();
            taskRepository.getTasks.mockResolvedValue('someValue');
            // taskRepository.getTasks.mockRejectedValue();

            expect(taskRepository.getTasks).not.toHaveBeenCalled();

            const filters: GetTasksFilterDto = {
                status: TaskStatus.IN_PROGRESS,
                search: 'Some search query'
            };
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and succesffuly retrive and return the task',
            async () => {
                const mockTask = { title: 'Test task', description: 'Test desc' };
                taskRepository.findOne.mockResolvedValue(mockTask);

                const result = await tasksService.getTaskById(1, mockUser);
                expect(result).toEqual(mockTask);

                expect(taskRepository.findOne).toHaveBeenCalledWith({
                    where: { id: 1, userId: mockUser.id }
                })

            });
        it('throw an error as task is not found', async () => {
            taskRepository.findOne.mockResolvedValue(null);
            // Because the getTaskById method return a Promise (rejected in this case)
            await expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    })

    describe('createTask', () => {
        it('calls taskRepository.createTask and returns the result', async () => {
            taskRepository.createTask.mockResolvedValue('someTask')

            expect(taskRepository.createTask).not.toHaveBeenCalled();

            const mockCreateTaskDto = { title: 'Test task', description: 'Test desc' };

            const result = await tasksService.createTask(mockCreateTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(mockCreateTaskDto, mockUser);

            expect(result).toEqual('someTask');
        });
    });

    describe('deleteTaskById', () => {
        it('calls taskRepository.deleteTaskById', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            expect(taskRepository.delete).not.toHaveBeenCalled();

            await tasksService.deleteTaskById(1, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({ id: 1, userId: mockUser.id });

        });

        it('throw an error as task could not be found', async () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            await expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateTaskStatusById', () => {
        it('updates a task status', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: TaskStatus.OPEN,
                save
            });

            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();

            const result = await tasksService.updateTaskStatusById(1, TaskStatus.DONE, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(TaskStatus.DONE);
        });
    });
});