import { Injectable } from '@nestjs/common';

import { BrandKeywordEntity } from './brand-keyword.entity';
import { BrandKeywordRepository } from './brand-keyword.repository';

@Injectable()
export class BrandKeywordsService {
  constructor(
    private readonly brandKeywordRepository: BrandKeywordRepository,
  ) {}

  async create(
    BrandKeywordObj: Omit<BrandKeywordEntity, 'id'>,
  ): Promise<BrandKeywordEntity> {
    const BrandKeyword = new BrandKeywordEntity();
    BrandKeyword.name = 'this is test';
    BrandKeyword.brands = BrandKeywordObj.brands;
    return this.brandKeywordRepository.save(BrandKeyword);
  }

  async findOneByName(name: string): Promise<BrandKeywordEntity> {
    return this.brandKeywordRepository.findOne({ name });
  }

  async findOrCreate(
    BrandKeywordObj: Omit<BrandKeywordEntity, 'id'>,
  ): Promise<BrandKeywordEntity> {
    const brandKeyword = await this.findOneByName(BrandKeywordObj.name);

    if (brandKeyword) {
      return brandKeyword;
    }

    return this.create(BrandKeywordObj);
  }

  async findAll(): Promise<BrandKeywordEntity[]> {
    return await this.brandKeywordRepository.find();
  }
}
