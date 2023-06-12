import { Inject, Injectable } from '@nestjs/common';
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
    const messages = await this.messagesRepository.find({
      relations: {
        author: true,
        room: true,
      },
    });

    return messages.map((message) => {
      return {
        ...message,
        author: {
          id: message.author.id,
          fullName: message.author.fullName,
        },
        room: {
          id: message.room.id,
          title: message.room.title,
        },
      };
    });
  }

  async findOne(id: number) {
    const message = await this.messagesRepository.findOne({
      where: {
        id,
      },
      relations: {
        author: true,
        room: true,
      },
    });

    return {
      ...message,
      author: {
        id: message.author.id,
        fullName: message.author.fullName,
      },
      room: {
        id: message.room.id,
        title: message.room.title,
      },
    };
  }

  update(id: number, dto: UpdateMessageDto) {
    return this.messagesRepository.update(id, dto);
  }

  remove(id: number) {
    return this.messagesRepository.delete(id);
  }
}
