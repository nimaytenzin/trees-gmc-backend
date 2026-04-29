import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const host = config.get<string>('DB_HOST', 'localhost');
    const port = config.get<number>('DB_PORT', 5432);
    const username = config.get<string>('DB_USER', 'postgres');
    const password = config.get<string>('DB_PASS', 'postgres');
    const database = config.get<string>('DB_NAME', 'trees_gmc');
    console.log('DB credentials:', { host, port, username, password, database });
    return ({
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    autoLoadEntities: true,
    synchronize: true, // Disable in production
    ssl: { rejectUnauthorized: false },
  });
  },
};
