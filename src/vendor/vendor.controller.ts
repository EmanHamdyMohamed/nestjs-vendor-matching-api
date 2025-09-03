import { Controller, Get, Post } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { Vendor } from './vendor.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('vendor')
@Controller('vendors')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  async create(@Body() createVendorDto: CreateVendorDto): Promise<Vendor> {
    return await this.vendorService.create(createVendorDto);
  }

  @Get()
  async findAll(): Promise<Vendor[]> {
    return await this.vendorService.findAll();
  }
}
