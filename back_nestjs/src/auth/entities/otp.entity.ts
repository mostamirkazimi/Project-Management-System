import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('password_resets')
export class Otp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  userId!: number;

  @Column({ length: 6 })
  otp!: string;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  used!: boolean;
}