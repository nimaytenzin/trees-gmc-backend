import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TreesService } from '../trees/trees.service';
import { SpeciesService } from '../species/species.service';

@ApiTags('Public')
@Controller('api/public')
export class PublicController {
  constructor(
    private readonly treesService: TreesService,
    private readonly speciesService: SpeciesService,
  ) {}

  @Get('statistics')
  getStatistics() {
    return this.treesService.getStatistics();
  }

  @Get('featured-tree')
  async getFeaturedTree() {
    const result = await this.treesService.findAll({ page: 1, limit: 1 });
    return result.items[0] || null;
  }

  @Get('species')
  getSpecies() {
    return this.speciesService.findAll();
  }

  @Get('trees')
  getTrees(@Query() filters: any) {
    return this.treesService.findAll({
      search: filters.search,
      healthCondition: filters.healthCondition,
      speciesId: filters.speciesId,
      page: filters.page ? parseInt(filters.page) : 1,
      limit: filters.limit ? parseInt(filters.limit) : 10,
    });
  }

  @Get('trees/map')
  getTreesForMap() {
    return this.treesService.findAllForMap();
  }

  @Get('trees/:id')
  getTree(@Param('id') id: string) {
    return this.treesService.findOne(id);
  }
}
