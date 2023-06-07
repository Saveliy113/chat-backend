import { DataSource } from 'typeorm';
import { MessageEntity } from './entities/message.entity';
export const messagesProvider = [
  {
    provide: 'MESSAGES_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(MessageEntity),
    inject: ['DATA_SOURCE'],
  },
];
