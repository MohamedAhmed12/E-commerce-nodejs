import { Module } from '@nestjs/common';

import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { BadgeModule } from './badge/badge.module';
import { BrandCategoryModule } from './brand-category/brand-category.module';
import { BrandModule } from './brand/brand.module';
import { CartItemModule } from './cart-item/cart-item.module';
import { CartModule } from './cart/cart.module';
import { CitiesModule } from './cities/cities.module';
import { CountriesModule } from './countries/countries.module';
import { CurrenciesModule } from './currencies/currencies.module';
import { FavouriteBrandModule } from './favourite-brand/favourite-brand.module';
import { FileModule } from './file/file.module';
import { GendersModule } from './genders/genders.module';
import { HealthModule } from './health/health.module';
import { LinesheetModule } from './linesheet/linesheet.module';
import { NotificationModule } from './notification/notification.module';
import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductColorModule } from './product-color/product-color.module';
import { ProductImageModule } from './product-image/product-image.module';
import { ProductLabelsModule } from './product-labels/product-labels.module';
import { ProductMaterialsModule } from './product-materials/product-materials.module';
import { ProductSeasonsModule } from './product-seasons/product-seasons.module';
import { ProductStylesModule } from './product-styles/product-styles.module';
import { ProductSubCategoryModule } from './product-sub-category/product-sub-category.module';
import { ProductThemesModule } from './product-themes/product-themes.module';
import { ProductModule } from './product/product.module';
import { RetailersModule } from './retailers/retailers.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    HealthModule,
    AccountModule,
    BrandModule,
    NotificationModule,
    FavouriteBrandModule,
    LinesheetModule,
    BadgeModule,
    ProductModule,
    ProductCategoryModule,
    ProductSubCategoryModule,
    BrandCategoryModule,
    ProductColorModule,
    CartModule,
    CartItemModule,
    ProductImageModule,
    FileModule,
    RetailersModule,
    CountriesModule,
    CitiesModule,
    GendersModule,
    ProductStylesModule,
    ProductThemesModule,
    ProductSeasonsModule,
    ProductLabelsModule,
    CurrenciesModule,
    ProductMaterialsModule,
  ],
})
export class CoreModule {}
