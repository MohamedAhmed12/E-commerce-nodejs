import { Injectable } from '@nestjs/common';

import { BadgeEntity } from './badge.entity';
import { BadgeRepository } from './badge.repository';

@Injectable({})
export class BadgeService {
  constructor(private readonly badgeRepository: BadgeRepository) {}

  async findOne(id: string): Promise<BadgeEntity> {
    return this.badgeRepository.findOne(id);
  }

  async findOneOrThrowError(id: string): Promise<BadgeEntity> {
    const badge = await this.findOne(id);

    if (!badge) {
      throw new Error(`Badge with id=${id} does not exists`);
    }

    return badge;
  }

  async findOrCreate(name: string): Promise<BadgeEntity> {
    const badge = await this.badgeRepository.findOne({ name });

    if (badge !== undefined) {
      return badge;
    }

    const newBadge = new BadgeEntity();
    newBadge.name = name;

    return await this.badgeRepository.save(newBadge);
  }

  async getBadges(): Promise<BadgeEntity[]> {
    return this.badgeRepository.find();
  }
}
