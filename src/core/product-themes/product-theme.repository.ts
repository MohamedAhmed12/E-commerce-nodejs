import { EntityRepository, Repository } from 'typeorm';

import { ProductThemeEntity } from './product-theme.entity';

@EntityRepository(ProductThemeEntity)
export class ProductThemeRepository extends Repository<ProductThemeEntity> {}
