import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import * as process from 'process';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }
    const token = authHeader.split(' ')[1] as string;
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    const payload = this.jwtService.verify(token, { secret: process.env.JWT_SECRET });
    req.user = payload as UserDto;
    next();
  }
}
