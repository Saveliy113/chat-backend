import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Repository } from 'typeorm';
import { RoomEntity } from './entities/room.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import { AddMemberDto } from './dto/add-member.dto';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('ROOMS_REPOSITORY')
    private roomsRepository: Repository<RoomEntity>,
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateRoomDto, userId: number) {
    const room = await this.roomsRepository.save({
      title: dto.title,
      description: dto.description,
      createdBy: { id: userId },
    });

    return this.roomsRepository.findOne({
      where: {
        id: room.id,
      },
      relations: ['createdBy', 'messages', 'participants'],
    });
  }

  async findAll() {
    const rooms = await this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.createdBy', 'users')
      .leftJoinAndSelect('room.messages', 'messages')
      .getMany();

    return rooms.map((room) => {
      return {
        ...room,
        createdBy: {
          id: room.createdBy.id,
          fullName: room.createdBy.fullName,
          email: room.createdBy.email,
        },
        messages: room.messages.slice(
          room.messages.length - 1,
          room.messages.length,
        ),
      };
    });
  }

  async findOne(id: number) {
    const room = await this.roomsRepository.findOne({
      where: {
        id,
      },
      relations: {
        createdBy: true,
        messages: true,
        participants: {
          fullName: true,
        },
      },
    });

    return {
      ...room,
      createdBy: {
        id: room.createdBy.id,
        fullName: room.createdBy.fullName,
        email: room.createdBy.email,
      },
    };
  }

  async update(id: number, dto: UpdateRoomDto) {
    const room = await this.roomsRepository.findOne({
      where: {
        id,
      },
      relations: ['participants'],
    });

    return this.roomsRepository.update(id, {
      title: dto.title,
      description: dto.description,
    });
  }

  async addMember(dto: AddMemberDto) {
    const member = await this.usersRepository.findOne({
      where: {
        id: dto.memberId,
      },
    });

    const room = await this.roomsRepository.findOne({
      where: {
        id: dto.roomId,
      },
      relations: ['participants'],
    });

    return this.roomsRepository.save({
      ...room,
      participants: [
        ...room.participants,
        {
          id: member.id,
          fullName: member.fullName,
        },
      ],
    });
    console.log(member);
    console.log(room);
  }

  async remove(id: number, userId: number) {
    const room = await this.roomsRepository.findOne({
      where: {
        id,
      },
      relations: ['createdBy'],
    });

    if (!room) {
      throw new NotFoundException('Комната не найдена');
    }

    if (room.createdBy.id !== userId) {
      throw new ForbiddenException('У вас нет доступа к удалению комнаты');
    }

    return this.roomsRepository.delete(id);
  }
}
