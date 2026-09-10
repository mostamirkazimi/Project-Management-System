import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { BlogStatus } from '../enum/blog-status.enum';

@Entity('blogs')
export class Blog {

  @PrimaryGeneratedColumn()
  id!: number;


  // =========================================================
  // Title
  // =========================================================

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  title!: string;


  // =========================================================
  // Excerpt
  // =========================================================

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  excerpt!: string | null;


  // =========================================================
  // Content
  // =========================================================

  @Column({
    type: 'text',
    nullable: false,
  })
  content!: string;


  // =========================================================
  // Image
  // =========================================================

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  image!: string | null;


  // =========================================================
  // Status
  // =========================================================

  @Column({
    type: 'enum',
    enum: BlogStatus,
    default: BlogStatus.DRAFT,
  })
  status!: BlogStatus;


  // =========================================================
  // Author
  // =========================================================

  @Column({
    type: 'int',
    nullable: false,
  })
  authorId!: number;

  @ManyToOne(
    () => User,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({
    name: 'authorId',
  })
  author!: User;


  // =========================================================
  // Dates
  // =========================================================

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}