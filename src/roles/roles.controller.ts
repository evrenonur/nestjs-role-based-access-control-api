import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';
import { Role } from './entities/role.entity';
import { RequirePermissions } from '../auth/decorators/require-permissions.decorator';
import { Permission } from './entities/permission.entity';

@ApiTags('roles')
@Controller('roles')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth('access-token')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  // Permissions endpoints
  @Get('permissions')
  @ApiOperation({ summary: 'Tüm izinleri listele' })
  @ApiResponse({ status: 200, description: 'İzinler başarıyla listelendi (boş dizi olabilir)' })
  @RequirePermissions('list:permission')
  findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Post('permissions')
  @ApiOperation({ summary: 'Yeni izin oluştur' })
  @ApiResponse({ status: 201, description: 'İzin başarıyla oluşturuldu' })
  @RequirePermissions('create:permission')
  createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return this.rolesService.createPermission(createPermissionDto);
  }

  @Get('permissions/:id')
  @ApiOperation({ summary: 'İzin detayını getir' })
  @ApiResponse({ status: 200, description: 'İzin detayı başarıyla getirildi' })
  @RequirePermissions('list:permission')
  findPermissionById(@Param('id') id: number) {
    return this.rolesService.findPermissionById(id);
  }

  @Put('permissions/:id')
  @ApiOperation({ summary: 'İzin güncelle' })
  @ApiResponse({ status: 200, description: 'İzin başarıyla güncellendi' })
  @RequirePermissions('update:permission')
  updatePermission(
    @Param('id') id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.rolesService.updatePermission(id, updatePermissionDto);
  }

  @Delete('permissions/:id')
  @ApiOperation({ summary: 'İzin sil' })
  @ApiResponse({ status: 200, description: 'İzin başarıyla silindi' })
  @RequirePermissions('delete:permission')
  deletePermission(@Param('id') id: number) {
    return this.rolesService.deletePermission(id);
  }

  // Roles endpoints
  @Post()
  @ApiOperation({ summary: 'Yeni rol oluştur' })
  @ApiResponse({ status: 201, description: 'Rol başarıyla oluşturuldu' })
  @RequirePermissions('create:role')
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.createRole(createRoleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm rolleri listele' })
  @ApiResponse({ status: 200, description: 'Roller başarıyla listelendi (boş dizi olabilir)' })
  @RequirePermissions('list:role')
  findAll() {
    return this.rolesService.findAllRoles();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Rol detayını getir' })
  @ApiResponse({ status: 200, description: 'Rol detayı başarıyla getirildi' })
  @RequirePermissions('list:role')
  findOne(@Param('id') id: number) {
    return this.rolesService.findRoleById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Rol güncelle' })
  @ApiResponse({ status: 200, description: 'Rol başarıyla güncellendi' })
  @RequirePermissions('update:role')
  update(@Param('id') id: number, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.updateRole(id, updateRoleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Rol sil' })
  @ApiResponse({ status: 200, description: 'Rol başarıyla silindi' })
  @RequirePermissions('delete:role')
  remove(@Param('id') id: number) {
    return this.rolesService.deleteRole(id);
  }

  @Put(':id/permissions')
  @ApiOperation({ summary: 'Role izinleri toplu ata' })
  @ApiResponse({ status: 200, description: 'İzinler başarıyla atandı' })
  @RequirePermissions('update:role')
  assignPermissions(
    @Param('id') roleId: string,
    @Body() assignPermissionsDto: AssignPermissionsDto,
  ): Promise<Role> {
    return this.rolesService.assignPermissions(Number(roleId), assignPermissionsDto);
  }

  @Post(':id/permissions/:permissionId')
  @ApiOperation({ summary: 'Role izin ekle' })
  @ApiResponse({ status: 200, description: 'İzin başarıyla eklendi' })
  @RequirePermissions('update:role')
  addPermission(
    @Param('id') roleId: string,
    @Param('permissionId') permissionId: string,
  ): Promise<Role> {
    return this.rolesService.addPermission(Number(roleId), Number(permissionId));
  }

  @Delete(':id/permissions/:permissionId')
  @ApiOperation({ summary: 'Rolden izin kaldır' })
  @ApiResponse({ status: 200, description: 'İzin başarıyla kaldırıldı' })
  @RequirePermissions('update:role')
  removePermission(
    @Param('id') roleId: string,
    @Param('permissionId') permissionId: string,
  ): Promise<Role> {
    return this.rolesService.removePermission(Number(roleId), Number(permissionId));
  }

  @Get(':id/permissions')
  @RequirePermissions('list:role')
  @ApiOperation({ summary: 'Rolün izinlerini getir' })
  getRolePermissions(@Param('id') roleId: string): Promise<Permission[]> {
    return this.rolesService.getRolePermissions(Number(roleId));
  }

  @Put(':id/toggle')
  @RequirePermissions('update:role')
  @ApiOperation({ summary: 'Rol durumunu değiştir (aktif/pasif)' })
  toggleRoleStatus(@Param('id') id: string): Promise<Role> {
    return this.rolesService.toggleRoleStatus(Number(id));
  }

  @Get('active')
  @RequirePermissions('list:role')
  @ApiOperation({ summary: 'Aktif rolleri listele' })
  findActiveRoles(): Promise<Role[]> {
    return this.rolesService.findActiveRoles();
  }
} 