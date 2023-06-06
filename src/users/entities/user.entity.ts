import { MessageEntity } from 'src/messages/entities/message.entity';
import { RoomEntity } from 'src/rooms/entities/room.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => MessageEntity, (message) => message.author)
  messages: MessageEntity[];

  @OneToMany(() => RoomEntity, (room) => room.createdBy, {
    eager: true,
  })
  createdRooms: RoomEntity[];

  @ManyToMany(() => RoomEntity, (room) => room.participants)
  rooms: RoomEntity[];

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;
}
