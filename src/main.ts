import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ConflictException } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { UsersService } from './users/users.service';
import { SpeciesService } from './species/species.service';
import { Role } from './common/enums/role.enum';

const DEFAULT_SPECIES = [
  { speciesId: 'SPEC-001', scientificName: 'Areca catechu', commonName: 'Areca Nut (Doma)', family: 'Arecaceae', description: "High economic value; a slender palm common in Gelephu's agricultural landscapes." },
  { speciesId: 'SPEC-002', scientificName: 'Pinus roxburghii', commonName: 'Chir Pine', family: 'Pinaceae', description: 'Found in drier subtropical slopes; fire-resistant and used for resin and timber.' },
  { speciesId: 'SPEC-003', scientificName: 'Schima khasiana', commonName: 'Needlewood', family: 'Theaceae', description: 'A dominant broadleaved evergreen tree in the region; excellent for reforestation.' },
  { speciesId: 'SPEC-004', scientificName: 'Magnolia lanuginosa', commonName: 'Magnolia', family: 'Magnoliaceae', description: 'A rare and high-value species found specifically in Gelephu; used for timber and ornament.' },
  { speciesId: 'SPEC-005', scientificName: 'Citrus reticulata', commonName: 'Mandarin Orange', family: 'Rutaceae', description: 'The primary cash crop fruit tree for the subtropical southern belt.' },
  { speciesId: 'SPEC-006', scientificName: 'Exbucklandia populnea', commonName: 'Pipli', family: 'Hamamelidaceae', description: 'Fast-growing timber species often associated with Magnolia forests in Sarpang.' },
  { speciesId: 'SPEC-007', scientificName: 'Persea americana', commonName: 'Avocado', family: 'Lauraceae', description: 'Recently promoted via the "Million Fruit Trees" project for high-value export.' },
  { speciesId: 'SPEC-008', scientificName: 'Carica papaya', commonName: 'Papaya', family: 'Caricaceae', description: 'Rapid-growth fruit tree ideal for quick seeding and yield in the Gelephu climate.' },
  { speciesId: 'SPEC-009', scientificName: 'Cinnamomum bejolghota', commonName: 'Wild Cinnamon', family: 'Lauraceae', description: 'Native broadleaved species; provides spice (bark/leaves) and ecological stability.' },
  { speciesId: 'SPEC-010', scientificName: 'Cephalostachyum latifolium', commonName: 'Jhi (Bamboo)', family: 'Poaceae', description: 'Large bamboo species that mass-seeded recently in Sarpang/Gelephu; vital for local crafts.' },
];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new TransformInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Trees-GMC API')
    .setDescription('Inventory and Growth Tracker for Gelephu Mindfulness City')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // Ensure default admin user exists
  const usersService = app.get(UsersService);
  const adminEmail = 'admin@gmc.com';
  const existingAdmin = await usersService.findByEmail(adminEmail);

  if (!existingAdmin) {
    await usersService.create({
      name: 'GMC Tree Admin',
      designation: 'Admin',
      email: adminEmail,
      password: 'GMC2026',
      role: Role.ADMIN,
    });
    // eslint-disable-next-line no-console
    console.log('Default admin user created with email', adminEmail);
  }

  // Ensure default enumerator user exists
  const enumeratorEmail = 'enumerator@gmc.com';
  const existingEnumerator = await usersService.findByEmail(enumeratorEmail);

  if (!existingEnumerator) {
    await usersService.create({
      name: 'GMC Tree Enumerator',
      designation: 'Enumerator',
      email: enumeratorEmail,
      password: 'GMC2026',
      role: Role.ENUMERATOR,
    });
    // eslint-disable-next-line no-console
    console.log('Default enumerator user created with email', enumeratorEmail);
  }

  // Ensure default species exist (seed if missing)
  const speciesService = app.get(SpeciesService);
  for (const dto of DEFAULT_SPECIES) {
    try {
      await speciesService.create(dto);
      // eslint-disable-next-line no-console
      console.log('Default species created:', dto.speciesId, dto.commonName);
    } catch (err) {
      if (err instanceof ConflictException) {
        // Species ID already exists, skip
      } else {
        throw err;
      }
    }
  }

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Server started on port ${port}`);
}
bootstrap();
