import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { Request } from 'express';
import { Role } from 'src/role/role.entity';

interface JwtPayload {
  email: string;
  id: number;
  role: number;
  iat?: number;
  exp?: number;
}

function safeDecodeJwt(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const decoded = Buffer.from(parts[1], 'base64').toString('utf8');
    const payload = JSON.parse(decoded) as unknown;
    if (
      typeof payload === 'object' &&
      payload !== null &&
      typeof (payload as Record<string, unknown>).email === 'string' &&
      typeof (payload as Record<string, unknown>).id === 'number' &&
      typeof (payload as Record<string, unknown>).role === 'number'
    ) {
      const { email, id, role, iat, exp } = payload as JwtPayload;
      return { email, id, role, iat, exp };
    }
    return null;
  } catch {
    return null;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const token = authHeader.slice('Bearer '.length);
    const payload = safeDecodeJwt(token);
    if (!payload) {
      throw new UnauthorizedException('Invalid token');
    }

    const role = await this.roleRepository.findOne({
      where: { id: payload.role },
    });
    if (!role || role.role !== 'admin') {
      throw new ForbiddenException('Admin role required');
    }

    return true;
  }
}