import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { RoleModule } from './role/role.module';
import { User } from './user/user.entity';
import { Role } from './role/role.entity';
import { Client } from './client/client.entity';
import { Project } from './project/project.entity';
import { Vendor } from './vendor/vendor.entity';
import { Match } from './matches/match.entity';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        return {
          type: 'mysql',
          host: process.env.MYSQL_HOST || 'mysql',
          port: Number(process.env.MYSQL_PORT || 3306),
          username: process.env.MYSQL_USER || 'vendor_user',
          password: process.env.MYSQL_PASSWORD || 'vendor_password',
          database: process.env.MYSQL_DATABASE || 'vendor_matching',
          autoLoadEntities: true,
          synchronize: true,
          entities: [User, Role, Client, Project, Vendor, Match],
        };
      },
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your-secret-key',
      signOptions: { expiresIn: '24h' },
    }),
    RoleModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'auth/login', method: RequestMethod.POST },
        { path: 'auth/register/client', method: RequestMethod.POST },
      );
  }
}
