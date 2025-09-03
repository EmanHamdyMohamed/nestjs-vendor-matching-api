import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Match } from './match.entity';

interface CreateMatchDto {
  projectId: number;
  vendorId: number;
  score: number;
}

interface UpdateMatchDto {
  score?: number;
}

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
  ) {}

  async create(createMatchDto: CreateMatchDto) {
    await this.matchRepository.create(createMatchDto);
  }

  async findOne(id: number): Promise<Match | null> {
    return await this.matchRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Match[]> {
    return await this.matchRepository.find({
      order: { score: 'DESC' },
    });
  }

  async findByProject(projectId: number): Promise<Match[]> {
    return await this.matchRepository.find({
      where: { projectId },
      order: { score: 'DESC' },
    });
  }

  async findByVendor(vendorId: number): Promise<Match[]> {
    return await this.matchRepository.find({
      where: { vendorId },
      order: { score: 'DESC' },
    });
  }

  async update(id: number, updateMatchDto: UpdateMatchDto) {
    await this.matchRepository.update(id, updateMatchDto);
  }

  async delete(id: number) {
    await this.matchRepository.delete(id);
  }
}
