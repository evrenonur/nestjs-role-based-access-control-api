import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { AssignPermissionsDto } from './dto/assign-permissions.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async createRole(createRoleDto: CreateRoleDto): Promise<Role> {
    const { name, description, permissionIds } = createRoleDto;
    
    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) }
    });
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('Bazı izinler bulunamadı');
    }

    const role = this.roleRepository.create({
      name,
      description,
      permissions,
    });

    return this.roleRepository.save(role);
  }

  async findAllRoles(): Promise<Role[]> {
    return this.roleRepository.find({
      relations: ['permissions'],
    });
  }

  async findRoleById(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });

    if (!role) {
      throw new NotFoundException('Rol bulunamadı');
    }

    return role;
  }

  async updateRole(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findRoleById(id);
    
    if (updateRoleDto.name) {
      role.name = updateRoleDto.name;
    }
    
    if (updateRoleDto.description) {
      role.description = updateRoleDto.description;
    }

    if (updateRoleDto.permissionIds) {
      const permissions = await this.permissionRepository.findByIds(updateRoleDto.permissionIds);
      if (permissions.length !== updateRoleDto.permissionIds.length) {
        throw new NotFoundException('Bazı izinler bulunamadı');
      }
      role.permissions = permissions;
    }

    return this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<void> {
    const result = await this.roleRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Rol bulunamadı');
    }
  }

  async findAllPermissions(): Promise<Permission[]> {
    return this.permissionRepository.find();
  }

  async createPermission(createPermissionDto: CreatePermissionDto): Promise<Permission> {
    const permission = this.permissionRepository.create(createPermissionDto);
    return this.permissionRepository.save(permission);
  }

  async findPermissionById(id: number): Promise<Permission> {
    const permission = await this.permissionRepository.findOne({ where: { id } });
    if (!permission) {
      throw new NotFoundException('İzin bulunamadı');
    }
    return permission;
  }

  async updatePermission(id: number, updatePermissionDto: UpdatePermissionDto): Promise<Permission> {
    const permission = await this.findPermissionById(id);
    
    if (updatePermissionDto.name) {
      permission.name = updatePermissionDto.name;
    }
    
    if (updatePermissionDto.description) {
      permission.description = updatePermissionDto.description;
    }

    return this.permissionRepository.save(permission);
  }

  async deletePermission(id: number): Promise<void> {
    const result = await this.permissionRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('İzin bulunamadı');
    }
  }

  async assignPermissions(roleId: number, assignPermissionsDto: AssignPermissionsDto): Promise<Role> {
    const role = await this.findRoleById(roleId);
    
    const permissions = await this.permissionRepository.find({
      where: { id: In(assignPermissionsDto.permissionIds) }
    });
    if (permissions.length !== assignPermissionsDto.permissionIds.length) {
      throw new NotFoundException('Bazı izinler bulunamadı');
    }

    role.permissions = permissions;
    return this.roleRepository.save(role);
  }

  async addPermission(roleId: number, permissionId: number): Promise<Role> {
    const role = await this.findRoleById(roleId);
    const permission = await this.permissionRepository.findOne({ where: { id: permissionId } });
    
    if (!permission) {
      throw new NotFoundException('İzin bulunamadı');
    }

    if (!role.permissions) {
      role.permissions = [];
    }

    // İzin zaten ekli mi kontrol et
    const hasPermission = role.permissions.some(p => p.id === permission.id);
    if (hasPermission) {
      throw new ConflictException('Bu izin zaten role atanmış');
    }

    role.permissions.push(permission);
    return this.roleRepository.save(role);
  }

  async removePermission(roleId: number, permissionId: number): Promise<Role> {
    const role = await this.findRoleById(roleId);
    
    if (!role.permissions || role.permissions.length === 0) {
      throw new NotFoundException('Role atanmış izin bulunamadı');
    }

    const hasPermission = role.permissions.some(p => p.id === permissionId);
    if (!hasPermission) {
      throw new NotFoundException('Rolde bu izin bulunamadı');
    }

    role.permissions = role.permissions.filter(permission => permission.id !== permissionId);
    return this.roleRepository.save(role);
  }

  async findRolesByIds(ids: number[]): Promise<Role[]> {
    const roles = await this.roleRepository.find({
      where: { id: In(ids) },
      relations: ['permissions'],
    });
    
    if (roles.length !== ids.length) {
      throw new NotFoundException('Bazı roller bulunamadı');
    }
    return roles;
  }

  async getRolePermissions(roleId: number): Promise<Permission[]> {
    const role = await this.findRoleById(roleId);
    return role.permissions;
  }

  async findActiveRoles(): Promise<Role[]> {
    return this.roleRepository.find({
      where: { isActive: true },
      relations: ['permissions'],
    });
  }

  async toggleRoleStatus(id: number): Promise<Role> {
    const role = await this.findRoleById(id);
    role.isActive = !role.isActive;
    return this.roleRepository.save(role);
  }
} 