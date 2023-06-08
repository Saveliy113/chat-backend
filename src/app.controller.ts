import { Controller, Post, Request, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {}
