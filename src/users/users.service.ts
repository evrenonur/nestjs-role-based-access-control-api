import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRolesDto } from './dto/assign-roles.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findByEmail(createUserDto.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanımda');
    }
    const user = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number | string): Promise<User | null> {
    const userId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    if (isNaN(userId)) {
      throw new NotFoundException('Geçersiz kullanıcı ID');
    }

    return this.usersRepository.findOne({ 
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    
    if (updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    return this.usersRepository.save(user);
  }

  async assignRoles(userId: number, assignRolesDto: AssignRolesDto): Promise<User> {
    const user = await this.findById(userId);
    
    const roles = await this.roleRepository.findByIds(assignRolesDto.roleIds);
    if (roles.length !== assignRolesDto.roleIds.length) {
      throw new NotFoundException('Bazı roller bulunamadı');
    }

    user.roles = roles;
    return this.usersRepository.save(user);
  }

  async addRole(userId: number, roleId: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    const role = await this.roleRepository.findOne({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Rol bulunamadı');
    }

    if (!user.roles) {
      user.roles = [];
    }

    // Rol zaten atanmış mı kontrol et
    const hasRole = user.roles.some(r => r.id === role.id);
    if (hasRole) {
      throw new ConflictException('Bu rol zaten kullanıcıya atanmış');
    }

    user.roles.push(role);
    return this.usersRepository.save(user);
  }

  async removeRole(userId: number, roleId: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    if (!user.roles || user.roles.length === 0) {
      throw new NotFoundException('Kullanıcıya atanmış rol bulunamadı');
    }

    const roleIdNumber = Number(roleId);
    const hasRole = user.roles.some(r => r.id === roleIdNumber);
    if (!hasRole) {
      throw new NotFoundException('Kullanıcıda bu rol bulunamadı');
    }

    user.roles = user.roles.filter(role => role.id !== roleIdNumber);
    return this.usersRepository.save(user);
  }

  async getUserRoles(userId: number): Promise<Role[]> {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }

    return user.roles || [];
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['roles', 'roles.permissions'],
    });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('Kullanıcı bulunamadı');
    }
    await this.usersRepository.remove(user);
  }

  async findOne(options: FindOneOptions<User>): Promise<User> {
    return this.usersRepository.findOne(options);
  }
} 