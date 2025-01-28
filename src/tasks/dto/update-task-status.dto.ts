import { IsEnum } from 'class-validator';
import { TaskStatus } from '../enum.model';

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
