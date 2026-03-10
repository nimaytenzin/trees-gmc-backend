import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './users/entities/user.entity';
import { Species } from './species/entities/species.entity';
import { Tree } from './trees/entities/tree.entity';
import { GrowthMetric } from './growth-metrics/entities/growth-metric.entity';
import { Role } from './common/enums/role.enum';
import { Condition, AmenityValue, TransplantSurvival, AssessmentType } from './common/enums/condition.enum';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  database: process.env.DB_NAME || 'trees_gmc',
  entities: [User, Species, Tree, GrowthMetric],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();
  console.log('Database connected');

  const userRepo = dataSource.getRepository(User);
  const speciesRepo = dataSource.getRepository(Species);
  const treeRepo = dataSource.getRepository(Tree);
  const metricRepo = dataSource.getRepository(GrowthMetric);

  // Seed Users
  const admin = userRepo.create({
    name: 'Admin User',
    designation: 'System Administrator',
    email: 'admin@treesgmc.bt',
    password: await bcrypt.hash('admin123', 10),
    role: Role.ADMIN,
  });
  const enumerator = userRepo.create({
    name: 'Karma Dorji',
    designation: 'Field Enumerator',
    email: 'karma@treesgmc.bt',
    password: await bcrypt.hash('enum123', 10),
    role: Role.ENUMERATOR,
  });
  await userRepo.save([admin, enumerator]);
  console.log('Users seeded');

  // Seed Species
  const speciesData = [
    { speciesId: 'SPEC-01', scientificName: 'Ficus religiosa', commonName: 'Bodhi Tree', family: 'Moraceae', description: 'Sacred fig tree native to the Indian subcontinent. A large deciduous tree known for its heart-shaped leaves and religious significance.' },
    { speciesId: 'SPEC-02', scientificName: 'Shorea robusta', commonName: 'Sal Tree', family: 'Dipterocarpaceae', description: 'A large deciduous tree native to South Asia. Important timber tree and has religious significance in Hinduism and Buddhism.' },
    { speciesId: 'SPEC-03', scientificName: 'Michelia champaca', commonName: 'Champak', family: 'Magnoliaceae', description: 'Large evergreen tree known for its strongly fragrant yellow or white flowers. Native to South and Southeast Asia.' },
    { speciesId: 'SPEC-04', scientificName: 'Cupressus cashmeriana', commonName: 'Bhutan Cypress', family: 'Cupressaceae', description: 'National tree of Bhutan. An elegant evergreen conifer with pendulous branchlets. Native to the eastern Himalayas.' },
    { speciesId: 'SPEC-05', scientificName: 'Magnolia campbellii', commonName: 'Campbell Magnolia', family: 'Magnoliaceae', description: 'A large deciduous tree known for spectacular pink or white flowers that bloom before the leaves appear. Native to the Himalayas.' },
    { speciesId: 'SPEC-06', scientificName: 'Pinus roxburghii', commonName: 'Chir Pine', family: 'Pinaceae', description: 'A large evergreen pine tree native to the Himalayas. Known for its long needles and resinous wood.' },
    { speciesId: 'SPEC-07', scientificName: 'Quercus lamellosa', commonName: 'Silver Oak', family: 'Fagaceae', description: 'A large evergreen oak tree found in the eastern Himalayas. Known for its large acorns and silvery undersides of leaves.' },
    { speciesId: 'SPEC-08', scientificName: 'Rhododendron arboreum', commonName: 'Tree Rhododendron', family: 'Ericaceae', description: 'National flower of Nepal. An evergreen tree with spectacular red flower clusters. Native to the Himalayas.' },
  ];

  const savedSpecies: Species[] = [];
  for (const sd of speciesData) {
    const species = speciesRepo.create(sd);
    savedSpecies.push(await speciesRepo.save(species));
  }
  console.log('Species seeded');

  // Seed Trees
  const conditions = [Condition.GOOD, Condition.GOOD, Condition.FAIR, Condition.GOOD, Condition.POOR];
  const amenities = [AmenityValue.HIGH, AmenityValue.MEDIUM, AmenityValue.LOW];
  const transplants = [TransplantSurvival.HIGH, TransplantSurvival.MEDIUM, TransplantSurvival.LOW];

  const treesData = [
    { treeId: 'GMC-T-0001', speciesIdx: 0, x: 90.5042, y: 26.8516, z: 300, year: 1980 },
    { treeId: 'GMC-T-0002', speciesIdx: 1, x: 90.5055, y: 26.8525, z: 305, year: 1995 },
    { treeId: 'GMC-T-0003', speciesIdx: 2, x: 90.5030, y: 26.8510, z: 298, year: 2005 },
    { treeId: 'GMC-T-0004', speciesIdx: 3, x: 90.5065, y: 26.8530, z: 312, year: 1970 },
    { treeId: 'GMC-T-0005', speciesIdx: 4, x: 90.5048, y: 26.8520, z: 295, year: 2010 },
    { treeId: 'GMC-T-0006', speciesIdx: 5, x: 90.5070, y: 26.8535, z: 320, year: 1985 },
    { treeId: 'GMC-T-0007', speciesIdx: 6, x: 90.5025, y: 26.8505, z: 290, year: 2000 },
    { treeId: 'GMC-T-0008', speciesIdx: 7, x: 90.5060, y: 26.8540, z: 318, year: 1990 },
    { treeId: 'GMC-T-0009', speciesIdx: 1, x: 90.5035, y: 26.8512, z: 302, year: 2015 },
    { treeId: 'GMC-T-0010', speciesIdx: 0, x: 90.5052, y: 26.8528, z: 308, year: 1975 },
  ];

  for (const td of treesData) {
    const baseH = 5 + Math.random() * 15;
    const tree = treeRepo.create({
      treeId: td.treeId,
      speciesId: savedSpecies[td.speciesIdx].id,
      xCoordinate: td.x,
      yCoordinate: td.y,
      zCoordinate: td.z,
    });
    const savedTree = (await treeRepo.save(tree)) as Tree;

    // Add 3 growth metrics over time (first = Initial assessment, rest = Periodic assessment)
    for (let i = 0; i < 3; i++) {
      const metric = metricRepo.create({
        assessmentType: i === 0 ? AssessmentType.INITIAL : AssessmentType.PERIODIC,
        heightM: +(baseH + i * 0.5).toFixed(2),
        dbhCm: +(20 + Math.random() * 30 + i * 2).toFixed(2),
        canopySpreadM: +(3 + Math.random() * 8 + i * 0.3).toFixed(2),
        remarks: i === 0 ? 'Initial measurement' : `Follow-up measurement ${i + 1}`,
        recordedAt: new Date(Date.now() - (2 - i) * 90 * 24 * 60 * 60 * 1000),
        treeId: savedTree.id,
        existingForm: conditions[Math.floor(Math.random() * conditions.length)],
        healthCondition: conditions[Math.floor(Math.random() * conditions.length)],
        amenityValue: amenities[Math.floor(Math.random() * amenities.length)],
        transplantSurvival: transplants[Math.floor(Math.random() * transplants.length)],
      });
      await metricRepo.save(metric);
    }
  }

  console.log('Trees and growth metrics seeded');
  console.log('\nSeed complete! Login credentials:');
  console.log('  Admin:      admin@treesgmc.bt / admin123');
  console.log('  Enumerator: karma@treesgmc.bt / enum123');

  await dataSource.destroy();
}

seed().catch(console.error);
