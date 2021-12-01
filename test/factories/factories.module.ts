import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CaslModule } from '../../src/common/casl/casl.module';
import { EmailMailingModule } from '../../src/common/email-mailing/email-mailing.module';
import { S3Module } from '../../src/common/s3/s3.module';
import { AccountModule } from '../../src/core/account/account.module';
import { AuthModule } from '../../src/core/auth/auth.module';
import { jwtConstants } from '../../src/core/auth/constants';
import { BadgeModule } from '../../src/core/badge/badge.module';
import { BrandModule } from '../../src/core/brand/brand.module';
import { CartItemModule } from '../../src/core/cart-item/cart-item.module';
import { CartModule } from '../../src/core/cart/cart.module';
import { FavouriteBrandModule } from '../../src/core/favourite-brand/favourite-brand.module';
import { LinesheetModule } from '../../src/core/linesheet/linesheet.module';
import { NotificationModule } from '../../src/core/notification/notification.module';
import { PersonalNotificationModule } from '../../src/core/personal-notification/personal-notification.module';
import { ProductCategoryModule } from '../../src/core/product-category/product-category.module';
import { ProductColorModule } from '../../src/core/product-color/product-color.module';
import { ProductSubCategoryModule } from '../../src/core/product-sub-category/product-sub-category.module';
import { ProductModule } from '../../src/core/product/product.module';
import { ResetPasswordTokenModule } from '../../src/core/reset-password-token/reset-password-token.module';
import { SessionModule } from '../../src/core/session/session.module';
import { SizeChartModule } from '../../src/core/size-chart/size-chart.module';
import { SizeModule } from '../../src/core/size/size.module';
import { UserModule } from '../../src/core/user/user.module';
import { UserRepository } from '../../src/core/user/user.repository';

import { AccountFactory } from './account.factory';
import { AuthFactory } from './auth.factory';
import { BadgFactory } from './badg.factory';
import { BrandFactory } from './brand.factory';
import { CartItemFactory } from './cart-item.factory';
import { FavouriteBrandFactory } from './favourite-brand.factory';
import { LinesheetFactory } from './linesheet.factory';
import { NotificationFactory } from './notification.factory';
import { PersonalNotificationFactory } from './personal-notification.factory';
import { ProductCategoryFactory } from './product-category.factory';
import { ProductColorFactory } from './product-color.factory';
import { ProductSubCategortFactory } from './product-sub-categort.factory';
import { ProductFactory } from './product.factory';
import { S3Factory } from './s3.factory';
import { SizeChartFactory } from './size-chart.factory';
import { SizeFactory } from './size.factory';
import { UserFactory } from './user.factory';

@Module({
  providers: [
    AuthFactory,
    UserFactory,
    AccountFactory,
    BrandFactory,
    NotificationFactory,
    PersonalNotificationFactory,
    FavouriteBrandFactory,
    BadgFactory,
    ProductFactory,
    JwtModule,
    UserRepository,
    LinesheetFactory,
    ProductColorFactory,
    ProductCategoryFactory,
    ProductSubCategortFactory,
    SizeChartFactory,
    SizeFactory,
    CartItemFactory,
    S3Factory,
  ],
  imports: [
    S3Module,
    CaslModule,
    UserModule,
    AuthModule,
    ConfigModule,
    AccountModule,
    SessionModule,
    ResetPasswordTokenModule,
    EmailMailingModule,
    NotificationModule,
    AccountModule,
    BrandModule,
    PersonalNotificationModule,
    FavouriteBrandModule,
    BadgeModule,
    ProductCategoryModule,
    ProductSubCategoryModule,
    LinesheetModule,
    ProductModule,
    ProductColorModule,
    SizeChartModule,
    SizeModule,
    CartModule,
    CartItemModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30h' },
    }),
  ],
  exports: [AuthFactory, UserFactory],
})
export class FactoriesModule {}
