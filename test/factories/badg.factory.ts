import { Injectable } from '@nestjs/common';

import { BadgeEntity } from '../../src/core/badge/badge.entity';
import { BadgeService } from '../../src/core/badge/badge.service';

@Injectable()
export class BadgFactory {
  constructor(private badgeService: BadgeService) {}

  async findOrCreate(name: string): Promise<BadgeEntity> {
    return await this.badgeService.findOrCreate(name);
  }
}
