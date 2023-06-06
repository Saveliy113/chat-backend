import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';

export const usersProvider = [
  {
    provide: 'USERS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(UserEntity),
    inject: ['DATA_SOURCE'],
  },
];
