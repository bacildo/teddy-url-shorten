import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Click } from '../urls/click.entity';
import { User } from '../auth/user.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  originalUrl!: string;

  @Column({ unique: true })
  shortUrl!: string;

  @Column({ default: 0 })
  clickCount!: number;

  @ManyToOne(() => User, (user) => user.urls, { nullable: true })
  owner!: User;

  @OneToMany(() => Click, (click) => click.url)
  clicks!: Click[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  deletedAt!: Date;
}
