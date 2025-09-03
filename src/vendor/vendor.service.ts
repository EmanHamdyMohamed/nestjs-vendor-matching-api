import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ArrayContains,
  LessThan,
  Like,
  MoreThanOrEqual,
  Raw,
  Repository,
} from 'typeorm';
import { Vendor } from './vendor.entity';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { CreateVendorDto } from './dto/create-vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepository.create(createVendorDto);
    return await this.vendorRepository.save(vendor);
  }

  async findOne(id: number): Promise<Vendor | null> {
    return await this.vendorRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Vendor[]> {
    return await this.vendorRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByName(name: string): Promise<Vendor[]> {
    return await this.vendorRepository.find({
      where: {
        name: Like(`%${name}%`),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByRating(minRating: number): Promise<Vendor[]> {
    return await this.vendorRepository.find({
      where: {
        rating: MoreThanOrEqual(minRating),
      },
      order: { rating: 'DESC' },
    });
  }

  async findByResponseTime(maxHours: number): Promise<Vendor[]> {
    return await this.vendorRepository.find({
      where: {
        responseSlaHours: LessThan(maxHours),
      },
      order: { responseSlaHours: 'ASC' },
    });
  }

  async update(id: number, updateVendorDto: UpdateVendorDto) {
    await this.vendorRepository.update(id, updateVendorDto);
  }

  async delete(id: number) {
    await this.vendorRepository.delete(id);
  }

  async updateRating(id: number, rating: number) {
    await this.vendorRepository.update(id, { rating });
  }

  async updateResponseTime(id: number, responseSlaHours: number) {
    await this.vendorRepository.update(id, {
      responseSlaHours,
    });
  }

  async findByCountryAndServices(
    country: string,
    servicesNeeded: string[],
  ): Promise<Vendor[]> {
    return await this.vendorRepository.find({
      where: {
        countriesSupported: Raw(
          (alias) => `JSON_CONTAINS(${alias}, :country)`,
          { country: JSON.stringify(country) },
        ),
        servicesOffered: Raw((alias) => `JSON_OVERLAPS(${alias}, :services)`, {
          services: JSON.stringify(servicesNeeded),
        }),
      },
    });
  }
}
