import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Repository } from 'typeorm';
import { MessageEntity } from './entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @Inject('MESSAGES_REPOSITORY')
    private messagesRepository: Repository<MessageEntity>,
  ) {}

  create(dto: CreateMessageDto, userId: number) {
    return this.messagesRepository.save({
      text: dto.text,
      author: { id: userId },
      room: { id: dto.roomId },
    });
  }

  async findAll() {
    const messages = await this.messagesRepository
      .createQueryBuilder('messages')
      .leftJoinAndSelect('messages.author', 'author')
      .leftJoinAndSelect('messages.room', 'room')
      .select([
        'messages',
        'author.id',
        'author.fullName',
        'room.id',
        'room.title',
      ])
      .getMany();

    return messages;
  }

  async findOne(id: number) {
    const message = await this.messagesRepository
      .createQueryBuilder('message')
      .where('message.id = :id', { id })
      .leftJoinAndSelect('message.author', 'author')
      .leftJoinAndSelect('message.room', 'room')
      .select([
        'message',
        'author.id',
        'author.fullName',
        'room.id',
        'room.title',
      ])
      .getOne();

    return message;
  }

  async update(id: number, dto: UpdateMessageDto, userId: number) {
    const message = await this.messagesRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });

    if (message.author.id !== userId) {
      throw new ForbiddenException(
        'У вас нет доступа к редактирования сообщения',
      );
    }

    return this.messagesRepository.update(id, dto);
  }

  async remove(id: number, userId: number) {
    const message = await this.messagesRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
      },
    });

    if (message.author.id !== userId) {
      throw new ForbiddenException('У вас нет доступа к удалению сообщения');
    }

    return this.messagesRepository.delete(id);
  }
}
