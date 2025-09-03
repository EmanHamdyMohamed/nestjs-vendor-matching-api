import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Client } from './client.entity';
import { Role } from 'src/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Client, Role])],
  providers: [ClientService, AdminGuard],
  exports: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
