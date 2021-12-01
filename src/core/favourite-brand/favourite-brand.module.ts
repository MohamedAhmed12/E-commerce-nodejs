import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaslModule } from 'src/common/casl/casl.module';

import { BrandModule } from '../brand/brand.module';

import { FavouriteBrandRepository } from './favourite-brand.repository';
import { FavouriteBrandResolver } from './favourite-brand.resolver';
import { FavouriteBrandService } from './favourite-brand.service';

@Module({
  providers: [FavouriteBrandResolver, FavouriteBrandService],
  imports: [
    BrandModule,
    CaslModule,
    TypeOrmModule.forFeature([FavouriteBrandRepository]),
  ],
  exports: [FavouriteBrandService],
})
export class FavouriteBrandModule {}
