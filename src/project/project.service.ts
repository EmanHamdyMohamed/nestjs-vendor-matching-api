import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Project } from './project.entity';
import { UserDto } from 'src/auth/dto/user.dto';
import { RoleService } from 'src/role/role.service';
import { VendorService } from 'src/vendor/vendor.service';
import { Match } from 'src/matches/match.entity';
import { EmailService } from 'src/email/email.service';
import { ProjectVendorMatchResponseDto } from './dto/project-vendor-match-response.dto';
import { CreateProjectDto } from './dto/create-project.dto';
import { MeDtoResponse } from 'src/auth/dto/me.dto';
import { UserService } from 'src/user/user.service';
import { ClientService } from 'src/client/client.service';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly roleService: RoleService,
    private readonly vendorService: VendorService,
    private readonly emailService: EmailService,
    @InjectDataSource() private dataSource: DataSource,
    private readonly userService: UserService,
    private readonly clientService: ClientService,
  ) {}

  async create(createProjectDto: CreateProjectDto, user: MeDtoResponse) {
    if (!user) {
      throw new UnauthorizedException();
    }
    const userEntity = await this.userService.findOne(user.id);
    const clientId = userEntity?.clientId;
    if (!clientId) {
      throw new UnauthorizedException();
    }
    const project = this.projectRepository.create({
      ...createProjectDto,
      clientId,
    });
    await this.projectRepository.save(project);
    return project;
  }

  async findOne(id: number): Promise<Project | null> {
    return await this.projectRepository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findByClient(clientId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { clientId },
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return await this.projectRepository.update(id, updateProjectDto);
  }

  async delete(id: number) {
    return await this.projectRepository.delete(id);
  }

  async changeStatus(id: number, status: string) {
    await this.projectRepository.update(id, { status });
  }

  async rebuildMatches(
    id: number,
    user: UserDto,
  ): Promise<ProjectVendorMatchResponseDto | null> {
    // Matching rules:
    // Vendors must cover same country
    // At least one service overlap
    // Score formula: services_overlap * 2 + rating + SLA_weight
    const userEntity = await this.userService.findOne(user.id);
    if (!userEntity) {
      throw new UnauthorizedException();
    }
    const project = await this.findOne(id);
    if (!project) {
      throw new Error('Project not found');
    }
    const adminRole = await this.roleService.findByRoleName('admin');
    if (
      project.clientId !== userEntity.clientId &&
      userEntity.roleId !== adminRole?.id
    ) {
      throw new UnauthorizedException();
    }
    const country = project.country;
    const servicesNeeded = project.servicesNeeded as string[];
    const candidateVendors = await this.vendorService.findByCountryAndServices(
      country,
      servicesNeeded,
    );
    const newMatches: Match[] = [];
    for (const vendor of candidateVendors) {
      const matchingServices = (vendor.servicesOffered as string[]).filter(
        (service: string) => servicesNeeded.includes(service),
      );
      const matchingServicesCount = matchingServices.length;
      const slaWeight = (24 - Number(vendor.responseSlaHours)) / 24;
      const finalScore =
        matchingServicesCount * 2 + Number(vendor.rating) + slaWeight;

      const match = {
        id: 0,
        projectId: project.id,
        vendorId: vendor.id,
        score: finalScore,
        createdAt: new Date(),
        updatedAt: new Date(),
        project: project,
        vendor: vendor,
      };
      newMatches.push(match);
    }
    const projectClient = await this.clientService.findOne(project.clientId);
    // Start transaction
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        // 1. DELETE existing matches for this project
        await transactionalEntityManager.delete(Match, {
          projectId: project.id,
        });
        // 2. CREATE new matches
        await transactionalEntityManager.save(Match, newMatches);
        // Send email to client with the new matches
        // 1. Send email to project.client.contact_email
        const emailData = {
          vendorsCount: newMatches.length,
          servicesNeeded: project.servicesNeeded,
          country: project.country,
          contactEmail: projectClient?.contactEmail,
          vendors: newMatches
            .map((match) => ({
              name: match.vendor.name,
              rating: match.vendor.rating,
              responseSlaHours: match.vendor.responseSlaHours,
              servicesOffered: match.vendor.servicesOffered,
              countriesSupported: match.vendor.countriesSupported,
              matchScore: match.score,
            }))
            .slice(0, 3),
        };
        await this.emailService.sendEmailWithTemplate(
          projectClient?.contactEmail || '',
          'New vendor matches found for your project',
          'vendor-match',
          emailData,
        );
        return {
          projectId: project.id,
          vendorsCount: newMatches.length,
          vendors: newMatches.map((match) => match.vendor.name).slice(0, 3),
        };
      },
    );
  }
}
