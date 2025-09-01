import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse<T> {
  @ApiProperty({ example: true })
  public success: boolean;

  @ApiProperty({ example: 200 })
  public statusCode: number;

  @ApiProperty({ example: 'Operation completed successfully' })
  public message: string;

  @ApiProperty()
  public data: T;

  @ApiProperty({ example: '2024-01-01T00:00:00.000Z' })
  public timestamp: string;

  constructor(data: T, message: string = 'Success', statusCode: number = 200) {
    this.success = statusCode >= 200 && statusCode < 300;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success<T>(data: T, message?: string, statusCode?: number): BaseResponse<T> {
    return new BaseResponse(data, message, statusCode);
  }

  static error<T>(message: string, statusCode: number = 500, data?: T): BaseResponse<T> {
    return new BaseResponse(data as T, message, statusCode);
  }
}
