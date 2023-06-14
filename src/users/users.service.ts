import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { ForbiddenException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @Inject('USERS_REPOSITORY')
    private usersRepository: Repository<UserEntity>,
  ) {}

  //Creating new user. First of all we check whether user with such email exists in database. If exists, it will throw exception. If not, registration attempt will be done.
  async register(dto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: dto.email,
      },
    });

    if (user) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(dto.password, saltOrRounds);

      return this.usersRepository.save({
        fullName: dto.fullName,
        email: dto.email,
        password: hash,
      });
    } catch (error) {
      throw new ForbiddenException('Ошибка при регистрации');
    }
  }

  findAll() {
    return this.usersRepository.find();
  }

  findById(id: number) {
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
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
    });

    if (dto.hasOwnProperty('password')) {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(dto.password, saltOrRounds);

      return this.usersRepository.update(id, {
        fullName: dto.fullName || user.fullName,
        email: dto.email || user.email,
        password: hash,
      });
    }

    return this.usersRepository.update(id, dto);
  }

  remove(id: number) {
    return this.usersRepository.delete(id);
  }
}
