import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TreesService } from './trees.service';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { TreeFilterDto } from './dto/tree-filter.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Trees')
@Controller('api/trees')
@UseGuards(JwtAuthGuard)
export class TreesController {
  private readonly logger = new Logger(TreesController.name);

  constructor(private readonly treesService: TreesService) {}

  @Post()
  async create(@Body() dto: CreateTreeDto, @CurrentUser() user: any) {
    this.logger.log({
      message: 'Creating tree',
      dto,
      user: user ? { id: user.id, email: user.email, role: user.role } : null,
    });
    try {
      return await this.treesService.create(dto, user);
    } catch (err: any) {
      // Log full error for PM2/Nest logs
      // eslint-disable-next-line no-console
      console.error('Error while creating tree:', err);
      throw err;
    }
  }

  @Get()
  findAll(@Query() filters: TreeFilterDto) {
    return this.treesService.findAll(filters);
  }

  @Get('map')
  findAllForMap() {
    return this.treesService.findAllForMap();
  }

  @Get('statistics')
  getStatistics() {
    return this.treesService.getStatistics();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.treesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTreeDto) {
    return this.treesService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.treesService.remove(id);
  }
}
