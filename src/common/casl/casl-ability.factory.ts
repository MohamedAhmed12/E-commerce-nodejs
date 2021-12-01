import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';

import { AccountEntity } from 'src/core/account/account.entity';
import { BrandEntity } from 'src/core/brand/brand.entity';
import { CartItemEntity } from 'src/core/cart-item/cart-item.entity';
import { LinesheetEntity } from 'src/core/linesheet/linesheet.entity';
import { NotificationEntity } from 'src/core/notification/notification.entity';
import { PersonalNotificationEntity } from 'src/core/personal-notification/personal-notification.entity';
import { ProductImageEntity } from 'src/core/product-image/product-image.entity';
import { ProductEntity } from 'src/core/product/product.entity';
import { SizeChartEntity } from 'src/core/size-chart/size-chart.entity';
import { SizeEntity } from 'src/core/size/size.entity';
import { UserEntity } from 'src/core/user/user.entity';
import {
  isBrandAdmin,
  isSystemOperator,
  isSystemUser,
} from 'src/core/user/user.helper';
import { AbilityType, AccountType } from 'src/graphql-types';

import { CaslAction } from './casl.constants';

type Subjects =
  | InferSubjects<
      | typeof AccountEntity
      | typeof BrandEntity
      | typeof LinesheetEntity
      | typeof UserEntity
      | typeof NotificationEntity
      | typeof PersonalNotificationEntity
      | typeof ProductEntity
      | typeof SizeChartEntity
      | typeof SizeEntity
      | typeof CartItemEntity
      | typeof ProductImageEntity
    >
  | 'all';

export type AppAbility = Ability<[CaslAction, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[CaslAction, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (isSystemUser(user)) {
      can(CaslAction.MANAGE, 'all');
      cannot(CaslAction.MANAGE_FAVOURITE, BrandEntity);
      cannot(CaslAction.READ_MY, BrandEntity);
      cannot(CaslAction.READ_MY, LinesheetEntity);
      cannot(CaslAction.READ_MY, ProductEntity);
      cannot(CaslAction.MANAGE, CartItemEntity);
      cannot(CaslAction.READ_MY, AccountEntity);

      if (isSystemOperator(user)) {
        cannot(CaslAction.MANAGE, UserEntity);
      }

      return build({
        detectSubjectType: (item) =>
          item.constructor as ExtractSubjectType<Subjects>,
      });
    }

    const canUserAccountHaveBrand =
      user?.account?.type === AccountType.SHOWROOM ||
      user?.account?.type === AccountType.BRAND_ACCOUNT ||
      user.abilityType === AbilityType.BRAND_CREATOR ||
      user.abilityType === AbilityType.BRAND_ADMIN;

    // AccountEntity
    can(CaslAction.READ_MY, AccountEntity);

    can(CaslAction.UPDATE, AccountEntity, {
      id: user?.account?.id,
    });

    // UserEntity for brand admin
    if (isBrandAdmin(user)) {
      can(CaslAction.MANAGE, UserEntity);
    }

    // BrandEntity

    if (canUserAccountHaveBrand) {
      can(CaslAction.CREATE, BrandEntity);
      can(CaslAction.UPDATE, BrandEntity, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: user?.brand?.id,
      });
      can(CaslAction.READ_MY, BrandEntity);
      can(CaslAction.DELETE, BrandEntity, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        id: user?.brand?.id,
      });
    }

    can(CaslAction.READ, BrandEntity);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cannot(CaslAction.READ, BrandEntity, {
      publishedAt: null,
      // 'account.id': { $ne: user?.account.id },
    });

    can(CaslAction.MANAGE_FAVOURITE, BrandEntity, {
      publishedAt: { $ne: null },
    });

    // LinesheetEntity

    if (canUserAccountHaveBrand) {
      can(CaslAction.CREATE, LinesheetEntity);
      can(CaslAction.UPDATE, LinesheetEntity, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'brand?.id': user?.brand?.id,
      });
      can(CaslAction.READ_MY, LinesheetEntity);
    }

    can(CaslAction.READ, LinesheetEntity);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    cannot(CaslAction.READ, LinesheetEntity, {
      isPublished: false,
      'brand?.id': user?.brand?.id,
    });

    // NotificationEntity

    can(CaslAction.READ, NotificationEntity);

    // PersonalNotificationEntity

    can(CaslAction.READ, PersonalNotificationEntity);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    can(CaslAction.UPDATE, PersonalNotificationEntity, { 'user.id': user.id });

    // ProductEntity

    can(CaslAction.READ, ProductEntity);

    if (canUserAccountHaveBrand) {
      can(CaslAction.CREATE, ProductEntity);
      can(CaslAction.UPDATE, ProductEntity, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'brand?.id': user?.brand?.id,
      });
      can(CaslAction.READ_MY, ProductEntity);
      can(CaslAction.DELETE, ProductEntity, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'brand?.id': user?.brand?.id,
      });

      cannot(CaslAction.READ, ProductEntity);

      can(CaslAction.READ, ProductEntity, {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        'brand?.id': user?.brand?.id,
      });
    }

    // SizeChartEntity
    can(CaslAction.READ, SizeChartEntity);

    // SizeEntity
    can(CaslAction.READ, SizeEntity);

    // CartItemEntity
    can(CaslAction.CREATE, CartItemEntity);
    can(CaslAction.READ_MY, CartItemEntity);
    can(CaslAction.UPDATE, CartItemEntity, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'cart.account.id': user?.account?.id,
    });
    can(CaslAction.DELETE, CartItemEntity, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      'cart.account.id': user?.account?.id,
    });

    if (canUserAccountHaveBrand) {
      cannot(CaslAction.MANAGE, CartItemEntity);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
