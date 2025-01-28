import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksEntity } from './tasks.entity';
import { AuthEntity } from 'src/auth/auth.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('/tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private readonly logger = new Logger('TasksController');
  constructor(
    private readonly tasksService: TasksService,
    private readonly configService: ConfigService,
  ) {
    console.log(configService.get('TEST_VALUE'));
  }

  @Get()
  getTask(
    @Query() filterDto: GetTasksFilterDto,
    @GetUser() user: AuthEntity,
  ): Promise<TasksEntity[]> {
    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    );
    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  async getTaskById(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<TasksEntity> {
    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  async createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: AuthEntity,
  ): Promise<TasksEntity> {
    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
    );
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') id: string,
    @GetUser() user: AuthEntity,
  ): Promise<void> {
    return this.tasksService.deleteTask(id, user);
  }

  @Patch('/:id/stauts')
  updatetaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatus: UpdateTaskStatusDto,
    @GetUser() user: AuthEntity,
  ): Promise<TasksEntity> {
    const { status } = updateTaskStatus;
    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
