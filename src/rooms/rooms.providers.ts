import { DataSource } from 'typeorm';
import { RoomEntity } from './entities/room.entity';
export const roomsProvider = [
  {
    provide: 'ROOMS_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(RoomEntity),
    inject: ['DATA_SOURCE'],
  },
];
