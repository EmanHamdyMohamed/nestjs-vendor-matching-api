import {
  Controller,
  Post,
  Get,
  Headers,
  BadRequestException,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { MeDto } from './dto/me.dto';
import { UserDto } from './dto/user.dto';
import { ApiTags } from '@nestjs/swagger';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    console.log('loginDto: ', loginDto);
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('register/client')
  async register(@Body() registerDto: RegisterDto): Promise<{ email: string }> {
    console.log('registerDto: ', registerDto);
    if (!registerDto || !registerDto.email || !registerDto.password) {
      throw new BadRequestException(
        'Invalid registration data. Please provide email, password, and role',
      );
    }
    await this.authService.registerClient(registerDto as unknown as UserDto);
    return {
      email: registerDto.email,
    };
  }

  @Get('me')
  async me(@Headers('Authorization') token: string): Promise<MeDto> {
    return await this.authService.me(token);
  }
}
