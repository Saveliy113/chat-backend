import { MessageEntity } from 'src/messages/entities/message.entity';
import { RoomEntity } from 'src/rooms/entities/room.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
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

  @OneToMany(() => RoomEntity, (room) => room.createdBy, {
    nullable: true,
  })
  createdRooms: RoomEntity[];

  @OneToMany(() => MessageEntity, (message) => message.author, {
    nullable: true,
  })
  messages: MessageEntity[];

  @ManyToMany(() => RoomEntity, (room) => room.participants, {
    nullable: true,
  })
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
