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
      relations: {
        createdBy: true,
      },
      select: {
        createdBy: {
          id: true,
          fullName: true,
          email: true,
        },
      },
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
    const qb = this.roomsRepository.createQueryBuilder('room');
    const room = await qb
      .where('room.id = :id', { id })
      .leftJoinAndSelect('room.createdBy', 'createdBy')
      .leftJoinAndSelect('room.messages', 'messages')
      .leftJoinAndSelect('messages.author', 'author')
      .leftJoinAndSelect('room.participants', 'participants')
      .select([
        'room',
        'messages',
        'author.id',
        'author.fullName',
        'participants.id',
        'participants.fullName',
        'participants.email',
        'createdBy.id',
        'createdBy.fullName',
      ])
      .getOne();

    return {
      ...room,
    };
  }

  async update(id: number, dto: UpdateRoomDto, userId: number) {
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
      throw new ForbiddenException(
        'У вас нет доступа к редактированию комнаты',
      );
    }

    return this.roomsRepository.update(id, {
      title: dto.title,
      description: dto.description,
    });
  }

  async addMember(dto: AddMemberDto, userId: number) {
    const member = await this.usersRepository.findOne({
      where: {
        id: dto.memberId,
      },
    });

    const room = await this.roomsRepository.findOne({
      where: {
        id: dto.roomId,
      },
      relations: ['participants', 'createdBy'],
    });

    if (!room) {
      throw new NotFoundException('Комната не найдена');
    }

    if (room.createdBy.id !== userId) {
      throw new ForbiddenException('У вас нет доступа к добавлению участников');
    }

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
