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
    console.log(dto, userId);
    return this.messagesRepository.save({
      text: dto.text,
      author: { id: userId },
      room: { id: dto.roomId },
    });
  }

  findAll() {
    return this.messagesRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
