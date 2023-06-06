import { RoomEntity } from 'src/rooms/entities/room.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('messages')
export class MessageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  author: UserEntity;

  @OneToMany(() => RoomEntity, (room) => room.messages)
  room: RoomEntity;

  @Column()
  text: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;
}
