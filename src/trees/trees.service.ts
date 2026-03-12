import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Tree } from './entities/tree.entity';
import { GrowthMetric } from '../growth-metrics/entities/growth-metric.entity';
import { CreateTreeDto } from './dto/create-tree.dto';
import { UpdateTreeDto } from './dto/update-tree.dto';
import { TreeFilterDto } from './dto/tree-filter.dto';
import { SurveyArea } from '../survey-areas/entities/survey-area.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class TreesService {
  constructor(
    @InjectRepository(Tree)
    private readonly treeRepository: Repository<Tree>,
    @InjectRepository(SurveyArea)
    private readonly surveyAreasRepository: Repository<SurveyArea>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateTreeDto, user?: { role?: Role }): Promise<Tree> {
    if (user?.role === Role.ENUMERATOR && !dto.surveyAreaId) {
      throw new BadRequestException('surveyAreaId is required for enumerator surveys');
    }

    if (dto.surveyAreaId) {
      const exists = await this.surveyAreasRepository.findOne({
        where: { id: dto.surveyAreaId },
      });
      if (!exists) throw new BadRequestException('Invalid surveyAreaId');
    }

    const tree = this.treeRepository.create(dto);
    const saved = await this.treeRepository.save(tree);
    return this.findOne(saved.id);
  }

  async findAll(filters: TreeFilterDto) {
    const {
      search,
      healthCondition,
      speciesId,
      surveyAreaId,
      heightOp,
      heightValue,
      dbhOp,
      dbhValue,
      canopyOp,
      canopyValue,
      page = 1,
      limit = 20,
    } = filters;

    const qb = this.treeRepository
      .createQueryBuilder('tree')
      .leftJoinAndSelect('tree.species', 'species')
      .leftJoinAndSelect('tree.growthMetrics', 'metric')
      .leftJoinAndSelect('tree.surveyArea', 'surveyArea')
      .orderBy('tree.createdAt', 'DESC')
      .addOrderBy('metric.recordedAt', 'DESC');

    const opSql: Record<string, string> = {
      eq: '=',
      gt: '>',
      gte: '>=',
      lt: '<',
      lte: '<=',
    };

    const addLatestMetricNumericFilter = (
      field: 'heightM' | 'dbhM' | 'canopySpreadM',
      op: string | undefined,
      value: number | undefined,
      paramName: string,
    ) => {
      if (!op || value === undefined || value === null || Number.isNaN(value)) return;
      const sqlOp = opSql[op];
      if (!sqlOp) return;

      qb.andWhere(
        `(SELECT gm."${field}" FROM growth_metrics gm WHERE gm."treeId" = tree.id ORDER BY gm."recordedAt" DESC LIMIT 1) ${sqlOp} :${paramName}`,
        { [paramName]: value },
      );
    };

    if (search) {
      qb.andWhere(
        '(tree.treeId ILIKE :search OR species.commonName ILIKE :search OR species.scientificName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (healthCondition) {
      qb.andWhere(
        `(SELECT gm."healthCondition" FROM growth_metrics gm WHERE gm."treeId" = tree.id ORDER BY gm."recordedAt" DESC LIMIT 1) = :healthCondition`,
        { healthCondition },
      );
    }

    if (speciesId) {
      qb.andWhere('tree.speciesId = :speciesId', { speciesId });
    }

    if (surveyAreaId) {
      qb.andWhere('tree.surveyAreaId = :surveyAreaId', { surveyAreaId });
    }

    addLatestMetricNumericFilter('heightM', heightOp, heightValue, 'heightValue');
    addLatestMetricNumericFilter('dbhM', dbhOp, dbhValue, 'dbhValue');
    addLatestMetricNumericFilter('canopySpreadM', canopyOp, canopyValue, 'canopyValue');

    const total = await qb.getCount();
    const trees = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      items: trees,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllForMap(): Promise<Tree[]> {
    return this.treeRepository
      .createQueryBuilder('tree')
      .leftJoinAndSelect('tree.species', 'species')
      .leftJoinAndSelect('tree.growthMetrics', 'metric')
      .leftJoinAndSelect('tree.surveyArea', 'surveyArea')
      .orderBy('metric.recordedAt', 'DESC')
      .getMany();
  }

  async findOne(id: string): Promise<Tree> {
    const tree = await this.treeRepository.findOne({
      where: { id },
      relations: ['species', 'surveyArea', 'growthMetrics', 'growthMetrics.photos'],
      order: { growthMetrics: { recordedAt: 'DESC' } },
    });
    if (!tree) throw new NotFoundException('Tree not found');
    return tree;
  }

  async update(id: string, dto: UpdateTreeDto): Promise<Tree> {
    const tree = await this.findOne(id);
    Object.assign(tree, dto);
    await this.treeRepository.save(tree);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const tree = await this.findOne(id);
    await this.treeRepository.remove(tree);
  }

  async getStatistics() {
    const total = await this.treeRepository.count();

    // Condition stats from latest growth metric per tree
    const conditionStats = await this.dataSource.query(
      `SELECT gm."healthCondition" as condition, COUNT(*)::text as count
       FROM (
         SELECT DISTINCT ON ("treeId") "treeId", "healthCondition"
         FROM growth_metrics
         WHERE "healthCondition" IS NOT NULL
         ORDER BY "treeId", "recordedAt" DESC
       ) gm
       GROUP BY gm."healthCondition"`,
    );

    // Avg metrics from latest growth metric per tree (trees no longer store height/dbh/canopy)
    const avgMetricsRow = await this.dataSource.query(
      `SELECT
         AVG(sub."heightM")::text as "avgHeight",
         AVG(sub."dbhM")::text as "avgDbh",
         AVG(sub."canopySpreadM")::text as "avgCanopy"
       FROM (
         SELECT DISTINCT ON ("treeId") "treeId", "heightM", "dbhM", "canopySpreadM"
         FROM growth_metrics
         ORDER BY "treeId", "recordedAt" DESC
       ) sub`,
    );
    const avgMetrics = avgMetricsRow?.[0] ?? { avgHeight: null, avgDbh: null, avgCanopy: null };

    const speciesCount = await this.dataSource
      .createQueryBuilder()
      .select('COUNT(DISTINCT tree.speciesId)', 'count')
      .from(Tree, 'tree')
      .getRawOne();

    return { total, conditionStats, avgMetrics, speciesCount: parseInt(speciesCount?.count || '0') };
  }
}
