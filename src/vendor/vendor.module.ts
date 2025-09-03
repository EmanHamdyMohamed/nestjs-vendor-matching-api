import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './vendor.entity';
import { VendorController } from './vendor.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Vendor])],
  providers: [VendorService],
  exports: [VendorService],
  controllers: [VendorController],
})
export class VendorModule {}
