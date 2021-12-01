import { Entity, ManyToOne } from 'typeorm';

// eslint-disable-next-line import/no-cycle
import { BrandEntity } from 'src/core/brand/brand.entity';
// eslint-disable-next-line import/no-cycle
import { UserEntity } from 'src/core/user/user.entity';

@Entity({ name: 'favourite_brands' })
export class FavouriteBrandEntity {
  @ManyToOne(() => UserEntity, (user) => user.favouriteBrands, {
    primary: true,
  })
  user: UserEntity;

  @ManyToOne(() => BrandEntity, (brand) => brand.users, { primary: true })
  brand: BrandEntity;
}
