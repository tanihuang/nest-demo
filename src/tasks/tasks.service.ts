import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from './enum.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksEntity } from './tasks.entity';
import { AuthEntity } from 'src/auth/auth.entity';
import { Logger } from '@nestjs/common';

@Injectable()
export class TasksService {
  private readonly logger = new Logger('TasksController');
  constructor(
    @InjectRepository(TasksEntity)
    private readonly tasksRepository: Repository<TasksEntity>,
  ) {}

  async getTasks(
    filterDto: GetTasksFilterDto,
    user: AuthEntity,
  ): Promise<TasksEntity[]> {
    const { status, search } = filterDto;
    const query = this.tasksRepository.createQueryBuilder('task');
    query.where({ user });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(filterDto)}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
    const tasks = await query.getMany();
    return tasks;
  }

  async getTaskById(id: string, user: AuthEntity): Promise<TasksEntity> {
    const found = await this.tasksRepository.findOne({
      where: { id, user },
    }); // Finds the first entity that matches given

    if (!found) {
      // throw new NotFoundException();
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    user: AuthEntity,
  ): Promise<TasksEntity> {
    const { title, description } = createTaskDto;

    const task = this.tasksRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });

    task.status = TaskStatus.DONE;
    await this.tasksRepository.save(task);
    return task;
  }

  // delete by id, remove by object
  async deleteTask(id: string, user: AuthEntity): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: AuthEntity,
  ): Promise<TasksEntity> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await this.tasksRepository.save(task);

    return task;
  }
}
