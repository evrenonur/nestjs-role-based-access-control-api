import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import { Role } from '../roles/entities/role.entity';
import { log } from 'console';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Kullanıcı profilini getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı profili başarıyla getirildi' })
  getProfile(@GetUser() user: User) {
    console.log('Profile User:', user); // Debug için
    const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    return this.usersService.findById(userId);
  }

  @Put('profile')
  @ApiOperation({ summary: 'Kullanıcı profilini güncelle' })
  @ApiResponse({ status: 200, description: 'Kullanıcı profili başarıyla güncellendi' })
  updateProfile(@GetUser() user: User, @Body() updateUserDto: UpdateUserDto) {
    const userId = typeof user.id === 'string' ? parseInt(user.id, 10) : user.id;
    return this.usersService.update(userId, updateUserDto);
  }

  @Post()
  @RequirePermissions('create:user')
  @ApiOperation({ summary: 'Yeni kullanıcı oluştur' })
  @ApiResponse({ status: 201, description: 'Kullanıcı başarıyla oluşturuldu' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @RequirePermissions('list:user')
  @ApiOperation({ summary: 'Tüm kullanıcıları listele' })
  @ApiResponse({ status: 200, description: 'Kullanıcılar başarıyla listelendi' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequirePermissions('list:user')
  @ApiOperation({ summary: 'Kullanıcı detayını getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcı detayı başarıyla getirildi' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(Number(id));
  }

  @Put(':id')
  @RequirePermissions('update:user')
  @ApiOperation({ summary: 'Kullanıcı güncelle' })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla güncellendi' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(Number(id), updateUserDto);
  }

  @Delete(':id')
  @RequirePermissions('delete:user')
  @ApiOperation({ summary: 'Kullanıcı sil' })
  @ApiResponse({ status: 200, description: 'Kullanıcı başarıyla silindi' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(Number(id));
  }

  @Put(':id/roles')
  @RequirePermissions('update:user')
  @ApiOperation({ summary: 'Kullanıcıya rolleri toplu ata' })
  @ApiResponse({ status: 200, description: 'Roller başarıyla atandı' })
  assignRoles(
    @Param('id') userId: string,
    @Body() assignRolesDto: AssignRolesDto,
  ): Promise<User> {
    return this.usersService.assignRoles(Number(userId), assignRolesDto);
  }

  @Post(':id/roles/:roleId')
  @RequirePermissions('update:user')
  @ApiOperation({ summary: 'Kullanıcıya rol ekle' })
  @ApiResponse({ status: 200, description: 'Rol başarıyla eklendi' })
  addRole(
    @Param('id') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<User> {
    return this.usersService.addRole(Number(userId), Number(roleId));
  }

  @Delete(':id/roles/:roleId')
  @RequirePermissions('update:user')
  @ApiOperation({ summary: 'Kullanıcıdan rol kaldır' })
  @ApiResponse({ status: 200, description: 'Rol başarıyla kaldırıldı' })
  removeRole(
    @Param('id') userId: string,
    @Param('roleId') roleId: string,
  ): Promise<User> {
    return this.usersService.removeRole(Number(userId), Number(roleId));
  }

  @Get(':id/roles')
  @RequirePermissions('list:user')
  @ApiOperation({ summary: 'Kullanıcının rollerini getir' })
  @ApiResponse({ status: 200, description: 'Roller başarıyla getirildi' })
  getUserRoles(@Param('id') userId: string): Promise<Role[]> {
    return this.usersService.getUserRoles(Number(userId));
  }
} 