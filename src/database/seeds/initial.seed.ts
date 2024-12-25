import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../users/entities/user.entity';
import { Role } from '../../roles/entities/role.entity';
import { Permission } from '../../roles/entities/permission.entity';
import * as bcrypt from 'bcrypt';

export default class InitialSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<void> {
    // Permission Repository
    const permissionRepository = dataSource.getRepository(Permission);
    
    // Permissions
    const permissions = await permissionRepository.save([
      { name: 'create:user', description: 'Kullanıcı oluşturma izni' },
      { name: 'update:user', description: 'Kullanıcı güncelleme izni' },
      { name: 'delete:user', description: 'Kullanıcı silme izni' },
      { name: 'list:user', description: 'Kullanıcıları listeleme izni' },
      { name: 'addRole:user', description: 'Kullanıcıya rol ekle' },
      { name: 'deleteRole:user', description: 'Kullanıcıdan rol kaldır' },
      { name: 'list:permission', description: 'İzinleri listeleme yetkisi' },
      { name: 'create:permission', description: 'Yeni izin oluşturma yetkisi' },
      { name: 'update:permission', description: 'İzin güncelleme yetkisi' },
      { name: 'list:role', description: 'Rolleri listeleme yetkisi' },
      { name: 'create:role', description: 'Yeni rol oluşturma yetkisi' },
      { name: 'update:role', description: 'Rol güncelleme yetkisi' },
      { name: 'delete:role', description: 'Rol silme yetkisi' },
    ]);

    // Role Repository
    const roleRepository = dataSource.getRepository(Role);

    // Admin Role
    const adminRole = await roleRepository.save({
      name: 'Admin',
      description: 'Sistem yöneticisi rolü',
      isActive: true,
      permissions: permissions,
    });

    // User Repository
    const userRepository = dataSource.getRepository(User);

    // Admin User
    await userRepository.save({
      name: 'John Doe',
      email: 'user@example.com',
      password: await bcrypt.hash('Password123!', 10),
      isActive: true,
      roles: [adminRole],
    });
  }
} 