import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from './enum.model';
import { AuthEntity } from 'src/auth/auth.entity';
import { Exclude } from 'class-transformer';

@Entity('tasks_entity')
export class TasksEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToOne((type) => AuthEntity, (user) => user.tasks, { eager: false })
  @Exclude({ toPlainOnly: true })
  user: AuthEntity;
}
