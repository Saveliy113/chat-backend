import { MessageEntity } from 'src/messages/entities/message.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @ManyToMany(() => UserEntity, (user) => user.rooms)
  @JoinTable()
  participants: UserEntity[];

  @ManyToOne(() => MessageEntity, (message) => message.room)
  messages: MessageEntity[];

  @ManyToOne(() => UserEntity, (user) => user.createdRooms)
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
