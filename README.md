<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


 # NestJS Role-Based Access Control API

## Proje Özeti
Bu proje, NestJS framework'ü kullanılarak geliştirilmiş, rol tabanlı yetkilendirme sistemi içeren bir REST API'dir. Kullanıcılar, roller ve izinler arasında ilişkiler kurarak güvenli bir yetkilendirme sistemi sağlar.

## Temel Özellikler
- JWT tabanlı kimlik doğrulama
- Rol tabanlı yetkilendirme (RBAC)
- İzin tabanlı erişim kontrolü
- Kullanıcı yönetimi
- Rol yönetimi
- İzin yönetimi
- Swagger API dokümantasyonu

## Teknolojiler
- NestJS
- TypeScript
- TypeORM
- MySQL
- JWT
- Swagger/OpenAPI
- Class Validator
- Class Transformer

## API Endpoint'leri

### Kimlik Doğrulama
- `POST /auth/login` - Kullanıcı girişi
- `POST /auth/register` - Yeni kullanıcı kaydı

### Kullanıcı Yönetimi
- `GET /users` - Tüm kullanıcıları listele
- `GET /users/:id` - Kullanıcı detayını getir
- `GET /users/profile` - Kullanıcı profilini getir
- `PUT /users/:id` - Kullanıcı güncelle
- `DELETE /users/:id` - Kullanıcı sil
- `PUT /users/:id/roles` - Kullanıcıya rol ata
- `POST /users/:id/roles/:roleId` - Kullanıcıya tek rol ekle
- `DELETE /users/:id/roles/:roleId` - Kullanıcıdan rol kaldır

### Rol Yönetimi
- `GET /roles` - Tüm rolleri listele
- `POST /roles` - Yeni rol oluştur
- `GET /roles/:id` - Rol detayını getir
- `PUT /roles/:id` - Rol güncelle
- `DELETE /roles/:id` - Rol sil
- `PUT /roles/:id/permissions` - Role izin ata
- `GET /roles/active` - Aktif rolleri listele
- `PUT /roles/:id/toggle` - Rol durumunu değiştir

### İzin Yönetimi
- `GET /roles/permissions` - Tüm izinleri listele
- `POST /roles/permissions` - Yeni izin oluştur
- `GET /roles/permissions/:id` - İzin detayını getir
- `PUT /roles/permissions/:id` - İzin güncelle
- `DELETE /roles/permissions/:id` - İzin sil

## Güvenlik Özellikleri
- JWT tabanlı kimlik doğrulama
- Şifrelerin bcrypt ile hashlenmesi
- Role-based access control (RBAC)
- Permission-based authorization
- API rate limiting
- Hassas verilerin (password) otomatik gizlenmesi

## Kurulum

```bash
# Repoyu klonla
git clone [repo-url]

# Bağımlılıkları yükle
npm install

# Veritabanı ayarlarını yap
.env dosyasını oluştur ve gerekli ayarları yap

# Seed verilerini yükle
npm run seed

# Uygulamayı başlat
npm run start:dev
```

## API Dokümantasyonu
Swagger UI dokümantasyonuna `http://localhost:3000/api` adresinden erişilebilir.
