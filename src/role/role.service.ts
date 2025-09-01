import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

interface CreateRoleDto {
  role: string;
}

interface UpdateRoleDto {
  role?: string;
}

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    await this.roleRepository.save(createRoleDto);
  }

  async findOne(id: number): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { id },
    });
  }

  async findByRoleName(role: string): Promise<Role | null> {
    return await this.roleRepository.findOne({
      where: { role },
    });
  }

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
  }

  async delete(id: number) {
    await this.roleRepository.delete(id);
  }

  async initializeDefaultRoles() {
    const defaultRoles = ['admin', 'client'];

    for (const roleName of defaultRoles) {
      const existingRole = await this.findByRoleName(roleName);
      if (!existingRole) {
        await this.create({ role: roleName });
      }
    }
  }

  async ensureRolesExist() {
    const roles = await this.findAll();
    if (roles.length === 0) {
      await this.initializeDefaultRoles();
    }
  }
}
