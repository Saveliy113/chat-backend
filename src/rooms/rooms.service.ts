import { Inject, Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Repository } from 'typeorm';
import { RoomEntity } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @Inject('ROOMS_REPOSITORY')
    private roomsRepository: Repository<RoomEntity>,
  ) {}

  async create(dto: CreateRoomDto) {
    const room = await this.roomsRepository.save({
      title: dto.title,
      description: dto.description,
      createdBy: { id: 1 },
    });

    return this.roomsRepository.findOne({
      where: {
        id: room.id,
      },
      relations: ['createdBy'],
    });
  }

  findAll() {
    return this.roomsRepository
      .createQueryBuilder('room')
      .leftJoinAndSelect('room.createdBy', 'users')
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} room`;
  }

  update(id: number, updateRoomDto: UpdateRoomDto) {
    return `This action updates a #${id} room`;
  }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}
