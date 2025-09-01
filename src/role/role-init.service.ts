import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RoleService } from './role.service';

@Injectable()
export class RoleInitService implements OnModuleInit {
  private readonly logger = new Logger(RoleInitService.name);

  constructor(private readonly roleService: RoleService) {}

  async onModuleInit() {
    this.logger.log('🔧 Initializing roles...');
    await this.roleService.ensureRolesExist();
    this.logger.log('✅ Roles initialization completed');
  }
}
