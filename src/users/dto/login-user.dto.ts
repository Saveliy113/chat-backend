import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail(undefined, { message: 'Некорректный email' })
  email: string;

  @Length(6, 32, {
    message: 'Пароль должен содержать не менее 6 символов',
  })
  password?: string;
}
