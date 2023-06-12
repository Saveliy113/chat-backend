import { RoomEntity } from 'src/rooms/entities/room.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages', {
  orderBy: {
    id: 'DESC',
  },
})
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  author: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.messages)
  room: RoomEntity;

  @Column()
  text: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
