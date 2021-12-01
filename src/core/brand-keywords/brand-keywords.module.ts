import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BrandKeywordsSeeder } from 'src/database/seeds/seeders/brand-keywords.seeder';

import { BrandModule } from '../brand/brand.module';

import { BrandKeywordRepository } from './brand-keyword.repository';
import { BrandKeywordsResolver } from './brand-keywords.resolver';
import { BrandKeywordsService } from './brand-keywords.service';

@Module({
  providers: [BrandKeywordsService, BrandKeywordsResolver, BrandKeywordsSeeder],
  imports: [TypeOrmModule.forFeature([BrandKeywordRepository]), BrandModule],
  exports: [BrandKeywordsService, BrandKeywordsSeeder],
})
export class BrandKeywordsModule {}
