import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { BaseResponse } from './common/base-response';
import {
  ApiResponse,
  ApiError,
} from './common/decorators/api-response.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  @Get('/health')
  async testDatabase(): Promise<BaseResponse<unknown>> {
    try {
      // Test database connection
      const isConnected = this.dataSource.isInitialized;

      // Get environment variables
      const envVars = {
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_PORT: process.env.MYSQL_PORT,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE,
        SMTP_HOST: process.env.SMTP_HOST,
        SMTP_PORT: process.env.SMTP_PORT,
        SMTP_USER: process.env.SMTP_USER,
        SMTP_FROM: process.env.SMTP_FROM,
        NODE_ENV: process.env.NODE_ENV,
      };

      // Test a simple query
      const result: unknown = await this.dataSource.query('SELECT 1 as test');

      const data: Record<string, unknown> = {
        connected: isConnected,
        environment: envVars,
        testQuery: result,
      };

      return ApiResponse(data, 'Database connection successful!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const data: Record<string, unknown> = {
        error: errorMessage,
        environment: {
          MYSQL_HOST: process.env.MYSQL_HOST,
          MYSQL_PORT: process.env.MYSQL_PORT,
          MYSQL_USER: process.env.MYSQL_USER,
          MYSQL_DATABASE: process.env.MYSQL_DATABASE,
          SMTP_HOST: process.env.SMTP_HOST,
          SMTP_PORT: process.env.SMTP_PORT,
          SMTP_USER: process.env.SMTP_USER,
          SMTP_FROM: process.env.SMTP_FROM,
          NODE_ENV: process.env.NODE_ENV,
        },
      };

      return ApiError('Database connection failed!', 500, data);
    }
  }
}
