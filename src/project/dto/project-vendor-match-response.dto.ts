import { ApiProperty } from '@nestjs/swagger';

export class ProjectVendorMatchResponseDto {
  @ApiProperty({ example: 1 })
  projectId: number;
  @ApiProperty({ example: 10 })
  vendorsCount: number;
  @ApiProperty({ example: ['Vendor 1', 'Vendor 2', 'Vendor 3'] })
  vendors: string[];
}
