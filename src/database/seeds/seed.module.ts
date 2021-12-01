import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from 'src/core/account/account.module';
import { BadgeModule } from 'src/core/badge/badge.module';
import { BrandBadgesModule } from 'src/core/brand-badges/brand-badges.module';
import { BrandCategoryModule } from 'src/core/brand-category/brand-category.module';
import { BrandKeywordsModule } from 'src/core/brand-keywords/brand-keywords.module';
import { BrandModule } from 'src/core/brand/brand.module';
import { CitiesModule } from 'src/core/cities/cities.module';
import { CountriesModule } from 'src/core/countries/countries.module';
import { CurrenciesModule } from 'src/core/currencies/currencies.module';
import { GendersModule } from 'src/core/genders/genders.module';
import { PaymentTermsModule } from 'src/core/payment-terms/payment-terms.module';
import { ProductCategoryModule } from 'src/core/product-category/product-category.module';
import { ProductColorModule } from 'src/core/product-color/product-color.module';
import { ProductLabelsModule } from 'src/core/product-labels/product-labels.module';
import { ProductMaterialsModule } from 'src/core/product-materials/product-materials.module';
import { ProductSeasonsModule } from 'src/core/product-seasons/product-seasons.module';
import { ProductStylesModule } from 'src/core/product-styles/product-styles.module';
import { ProductSubCategoryModule } from 'src/core/product-sub-category/product-sub-category.module';
import { ProductThemesModule } from 'src/core/product-themes/product-themes.module';
import { RetailersModule } from 'src/core/retailers/retailers.module';
import { ShippingTermsModule } from 'src/core/shipping-terms/shipping-terms.module';
import { SizeChartModule } from 'src/core/size-chart/size-chart.module';
import { SizeModule } from 'src/core/size/size.module';
import { UserModule } from 'src/core/user/user.module';

import { SeedService } from './seed.service';

@Module({
  providers: [SeedService],
  imports: [
    UserModule,
    BadgeModule,
    ProductCategoryModule,
    ProductSubCategoryModule,
    ProductColorModule,
    ConfigModule,
    SizeChartModule,
    SizeModule,
    AccountModule,
    BrandModule,
    RetailersModule,
    CountriesModule,
    CitiesModule,
    GendersModule,
    BrandCategoryModule,
    BrandBadgesModule,
    ProductStylesModule,
    ProductThemesModule,
    ProductSeasonsModule,
    ProductLabelsModule,
    ShippingTermsModule,
    PaymentTermsModule,
    BrandKeywordsModule,
    CurrenciesModule,
    ProductMaterialsModule,
  ],
})
export class SeedModule {}
