import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { UsersService } from './users/users.service';
import { UserEntity } from './users/entities/user.entity';
import { jwtConstants } from './auth/constants';

export interface AuthSocket extends Socket {
  user: Partial<UserEntity>;
}

export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;

export const WSAuthMiddleware = (
  jwtService: JwtService,
  userService: UsersService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      const jwtPayload = await jwtService.verify(
        socket.handshake.headers.authorization ?? '',
        {
          publicKey: jwtConstants.secret,
        },
      );

      const user = await userService.findById(jwtPayload.sub);

      if (user) {
        socket.user = {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        };
        next();
      } else {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    } catch (error) {
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      });
    }
  };
};
