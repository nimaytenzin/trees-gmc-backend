import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@ApiTags('Users')
@Controller('api/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('enumerators/template')
  async getEnumeratorsTemplate(@Res() res: Response) {
    const csv = this.usersService.getEnumeratorsCsvTemplate();
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="enumerators-template.csv"');
    res.send(csv);
  }

  @Get('enumerators')
  findAllEnumerators() {
    return this.usersService.findAllEnumerators();
  }

  @Post('enumerators/bulk')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 1024 * 1024 },
    }),
  )
  async bulkUploadEnumerators(@UploadedFile() file: Express.Multer.File) {
    if (!file?.buffer) {
      return { created: 0, errors: ['No file uploaded'] };
    }
    return this.usersService.bulkCreateEnumeratorsFromCsv(file.buffer);
  }

  @Put(':id/password')
  async changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
  ) {
    await this.usersService.changePassword(id, dto.newPassword, dto.currentPassword);
    return { message: 'Password updated' };
  }

  @Patch(':id/active')
  async setActive(
    @Param('id') id: string,
    @Body() body: { isActive: boolean },
  ) {
    return this.usersService.setActive(id, body.isActive);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
