import { EntityRepository, Repository } from 'typeorm';

import { FavouriteBrandEntity } from './favourite-brand.entity';

@EntityRepository(FavouriteBrandEntity)
export class FavouriteBrandRepository extends Repository<FavouriteBrandEntity> {}
