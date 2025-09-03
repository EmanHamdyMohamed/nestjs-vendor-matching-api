import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { Body } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  async create(@Body() createClientDto: CreateClientDto): Promise<unknown> {
    return await this.clientService.create(createClientDto);
  }

  @UseGuards(AdminGuard)
  @Get()
  async findAll(): Promise<unknown> {
    return await this.clientService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<unknown> {
    return await this.clientService.findOne(Number(id));
  }
}
