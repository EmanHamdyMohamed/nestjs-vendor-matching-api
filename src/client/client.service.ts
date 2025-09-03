import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './client.entity';

@Injectable()
export class ClientService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const client = this.clientRepository.create(createClientDto);
    return await this.clientRepository.save(client);
  }

  async findOne(id: number): Promise<Client | null> {
    return await this.clientRepository.findOne({ where: { id } });
  }

  async findByEmail(contactEmail: string): Promise<Client | null> {
    return await this.clientRepository.findOne({ where: { contactEmail } });
  }

  async findAll(page = 1, limit = 20): Promise<Client[]> {
    return await this.clientRepository.find({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async update(id: number, updateClientDto: UpdateClientDto): Promise<Client> {
    await this.clientRepository.update(id, updateClientDto);
    const updatedClient = await this.clientRepository.findOne({ where: { id } });
    if (!updatedClient) {
      throw new Error('Client not found');
    }
    return updatedClient;
  }

  async delete(id: number): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new Error('Client not found');
    }
    await this.clientRepository.remove(client);
    return client;
  }
}
