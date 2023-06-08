import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDto) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(dto.password, saltOrRounds);

    return this.usersRepository.save({
      fullName: dto.fullName,
      email: dto.email,
      password: hash,
    });
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByCond(dto: LoginUserDto) {
    return this.usersRepository.findOne({
      where: {
        email: dto.email,
        password: dto.password,
      },
    });
  }

  update(id: number, dto: UpdateUserDto) {
    return this.usersRepository.update(id, dto);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
