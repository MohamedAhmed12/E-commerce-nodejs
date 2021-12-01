import { Injectable } from '@nestjs/common';

import { BrandBadgeEntity } from './brand-badge.entity';
import { BrandBadgeRepository } from './brand-badge.repository';

@Injectable()
export class BrandBadgesService {
  constructor(private readonly brandBadgeRepository: BrandBadgeRepository) {}

  async create(name: string): Promise<BrandBadgeEntity> {
    const brandBadge = new BrandBadgeEntity();
    brandBadge.name = name;

    return this.brandBadgeRepository.save(brandBadge);
  }

  async findOne(id: string): Promise<BrandBadgeEntity> {
    return await this.brandBadgeRepository.findOne(id);
  }

  async findAll(): Promise<BrandBadgeEntity[]> {
    return await this.brandBadgeRepository.find();
  }
}
