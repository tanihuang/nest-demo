import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TasksEntity } from 'src/tasks/tasks.entity';

@Entity('user_entity')
export class AuthEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany((type) => TasksEntity, (task) => task.user, { eager: true })
  tasks: TasksEntity[];
}
