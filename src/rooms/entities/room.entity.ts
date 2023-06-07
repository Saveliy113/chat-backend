import { MessageEntity } from 'src/messages/entities/message.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({
    nullable: true,
  })
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.rooms)
  @JoinTable()
  participants: UserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'createdBy' })
  createdBy: UserEntity;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @CreateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
