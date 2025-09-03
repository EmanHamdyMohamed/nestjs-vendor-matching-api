import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './project.entity';
import { ProjectController } from './project.controller';
import { RoleModule } from 'src/role/role.module';
import { VendorModule } from 'src/vendor/vendor.module';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { UserModule } from 'src/user/user.module';
import { ClientModule } from 'src/client/client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    RoleModule,
    VendorModule,
    EmailModule,
    UserModule,
    ClientModule,
  ],
  providers: [ProjectService, EmailService],
  exports: [ProjectService],
  controllers: [ProjectController],
})
export class ProjectModule {}
