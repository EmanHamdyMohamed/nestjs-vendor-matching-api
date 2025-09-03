import { Body, Controller, Param, Post, Req } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateProjectDto } from './dto/create-project.dto';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post(':id/matches/rebuild')
  async rebuildMatches(
    @Req() req: any,
    @Param('id') id: string,
  ): Promise<unknown> {
    return await this.projectService.rebuildMatches(Number(id), req.user);
  }

  @Post()
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Req() req: any,
  ): Promise<unknown> {
    return await this.projectService.create(createProjectDto, req.user);
  }
}
