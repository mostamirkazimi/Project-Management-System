import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('registration_otps')
export class RegistrationOtp {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  firstName!: string;

  @Column({ length: 255 })
  lastName!: string;

  @Column({ length: 255 })
  email!: string;

  @Column({ length: 255 })
  phone!: string;

  @Column({ length: 255, nullable: true })
  address!: string;

  @Column({ length: 255 })
  city!: string;

  @Column()
  password!: string;

  @Column({ length: 6 })
  otp!: string;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  verified!: boolean;

  @Column({
  length: 500,
  nullable: true,
})
profileImage!: string;
}