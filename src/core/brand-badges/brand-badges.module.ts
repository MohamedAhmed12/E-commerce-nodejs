import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandBadgesSeeder } from 'src/database/seeds/seeders/brand-badges.seeder';

import { BrandBadgeRepository } from './brand-badge.repository';
import { BrandBadgesResolver } from './brand-badges.resolver';
import { BrandBadgesService } from './brand-badges.service';

@Module({
  providers: [BrandBadgesService, BrandBadgesResolver, BrandBadgesSeeder],
  imports: [TypeOrmModule.forFeature([BrandBadgeRepository])],
  exports: [BrandBadgesService, BrandBadgesSeeder],
})
export class BrandBadgesModule {}
