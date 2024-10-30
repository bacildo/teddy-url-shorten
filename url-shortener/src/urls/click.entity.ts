import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Url } from '../urls/url.entity';

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Url, (url) => url.clicks)
  url!: Url;

  @CreateDateColumn()
  accessedAt!: Date;
}
