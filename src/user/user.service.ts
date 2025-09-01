import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

interface CreateUserDto {
  email: string;
  password: string;
  roleId: number;
  clientId?: number | null;
}

interface UpdateUserDto {
  email?: string;
  password?: string;
  roleId?: number;
  clientId?: number;
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { id },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async findByRole(roleId: number): Promise<User[]> {
    return await this.userRepository.find({
      where: { roleId },
    });
  }

  async findByClient(clientId: number): Promise<User[]> {
    return await this.userRepository.find({
      where: { clientId },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async save(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
  }

  async delete(id: number) {
    await this.userRepository.delete(id);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
