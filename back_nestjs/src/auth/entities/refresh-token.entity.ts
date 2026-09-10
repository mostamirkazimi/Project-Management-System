import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column({ type: 'text' })
  token!: string;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  revoked!: boolean;
}