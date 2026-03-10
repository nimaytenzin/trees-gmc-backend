import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../common/enums/role.enum';

const ENUMERATOR_CSV_HEADER = 'name,designation,email,password';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllEnumerators(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: Role.ENUMERATOR },
      order: { name: 'ASC' },
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.userRepository.remove(user);
  }

  getEnumeratorsCsvTemplate(): string {
    return ENUMERATOR_CSV_HEADER + '\n' + 'Example User,Field Enumerator,enumerator@example.com,ChangeMe123';
  }

  async bulkCreateEnumeratorsFromCsv(buffer: Buffer): Promise<{ created: number; errors: string[] }> {
    const text = buffer.toString('utf-8').trim();
    const lines = text.split(/\r?\n/).filter((line) => line.trim());
    if (lines.length < 2) {
      throw new BadRequestException('CSV must have header row and at least one data row');
    }
    const header = lines[0].toLowerCase();
    if (!header.includes('name') || !header.includes('email') || !header.includes('password')) {
      throw new BadRequestException('CSV must include columns: name, email, password');
    }
    const errors: string[] = [];
    let created = 0;
    const keys = parseCsvRow(lines[0]);
    const nameIdx = keys.findIndex((k) => k.toLowerCase() === 'name');
    const designationIdx = keys.findIndex((k) => k.toLowerCase() === 'designation');
    const emailIdx = keys.findIndex((k) => k.toLowerCase() === 'email');
    const passwordIdx = keys.findIndex((k) => k.toLowerCase() === 'password');
    if (nameIdx === -1 || emailIdx === -1 || passwordIdx === -1) {
      throw new BadRequestException('CSV must include columns: name, email, password');
    }
    for (let i = 1; i < lines.length; i++) {
      const row = parseCsvRow(lines[i]);
      const name = row[nameIdx]?.trim();
      const email = row[emailIdx]?.trim();
      const password = row[passwordIdx]?.trim();
      const designation = designationIdx >= 0 ? row[designationIdx]?.trim() : undefined;
      if (!name || !email || !password) {
        errors.push(`Row ${i + 1}: name, email and password are required`);
        continue;
      }
      if (password.length < 6) {
        errors.push(`Row ${i + 1}: password must be at least 6 characters`);
        continue;
      }
      const existing = await this.userRepository.findOne({ where: { email } });
      if (existing) {
        errors.push(`Row ${i + 1}: email ${email} already exists`);
        continue;
      }
      const user = this.userRepository.create({
        name,
        designation,
        email,
        password,
        role: Role.ENUMERATOR,
        isActive: true,
      });
      await this.userRepository.save(user);
      created++;
    }
    return { created, errors };
  }

  async changePassword(
    userId: string,
    newPassword: string,
    currentPassword?: string,
  ): Promise<void> {
    const user = await this.findById(userId);
    if (currentPassword !== undefined) {
      const match = await bcrypt.compare(currentPassword, user.password);
      if (!match) throw new BadRequestException('Current password is incorrect');
    }
    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async setActive(userId: string, isActive: boolean): Promise<User> {
    const user = await this.findById(userId);
    user.isActive = isActive;
    return this.userRepository.save(user);
  }
}

function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if (inQuotes) {
      current += c;
    } else if (c === ',') {
      result.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  result.push(current.trim());
  return result;
}
