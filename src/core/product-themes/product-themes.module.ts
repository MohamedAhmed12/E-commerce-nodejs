import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductThemesSeeder } from 'src/database/seeds/seeders/product-themes.seeder';

import { ProductThemeRepository } from './product-theme.repository';
import { ProductThemesResolver } from './product-themes.resolver';
import { ProductThemesService } from './product-themes.service';

@Module({
  providers: [ProductThemesService, ProductThemesResolver, ProductThemesSeeder],
  imports: [TypeOrmModule.forFeature([ProductThemeRepository])],
  exports: [ProductThemesService, ProductThemesSeeder],
})
export class ProductThemesModule {}
