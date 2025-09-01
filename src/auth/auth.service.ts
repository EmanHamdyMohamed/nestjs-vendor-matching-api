import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MeDto } from './dto/me.dto';
import { RoleService } from 'src/role/role.service';
import { LoginResponseDto } from './dto/login-response.dto';

interface CreateUserDto {
  email: string;
  password: string;
  roleId: number;
  clientId?: number | null;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  async login(email: string, pass: string): Promise<LoginResponseDto> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }
    // Compare the input password with the stored hash
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException();
    }
    const payload = { email: user.email, id: user.id, role: user.roleId };
    const role = await this.roleService.findOne(user.roleId);
    return {
      token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: role?.role,
        clientId: user.clientId,
      },
      role: user.roleId,
      clientId: user.clientId,
      tokenType: 'Bearer',
    };
  }

  async registerClient(user: CreateUserDto): Promise<boolean> {
    const existingUser = await this.userService.findByEmail(user.email);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const clientRole = await this.roleService.findByRoleName('client');
    if (!clientRole) {
      throw new ConflictException('Client role not found');
    }
    const hashedPassword = await bcrypt.hash(user.password, 10);
    // Create user using the UserService create method
    const userToCreate = {
      email: user.email,
      password: hashedPassword,
      roleId: clientRole.id,
      clientId: user.clientId,
    };
    await this.userService.create(userToCreate);
    return true;
  }

  async me(token: string): Promise<MeDto> {
    const decoded = await this.jwtService.decode(token.split(' ')[1]);
    console.log('decoded: ', decoded);
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      throw new UnauthorizedException();
    }
    const user = await this.userService.findOne(decoded.id as number);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user as unknown as MeDto;
  }
}
