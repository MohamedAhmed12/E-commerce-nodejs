import { Injectable } from '@nestjs/common';

import { LinesheetEntity } from '../../src/core/linesheet/linesheet.entity';
import { LinesheetService } from '../../src/core/linesheet/linesheet.service';
import { UserEntity } from '../../src/core/user/user.entity';

@Injectable()
export class LinesheetFactory {
  constructor(private linesheetService: LinesheetService) {}

  async create(
    brandId: string,
    title: string,
    description: string,
    user: UserEntity,
  ): Promise<LinesheetEntity> {
    return await this.linesheetService.createLinesheet(
      {
        brandId,
        title,
        description,
      },
      user,
    );
  }

  async publishLinesheet(
    linesheetId: string,
    user: UserEntity,
  ): Promise<LinesheetEntity> {
    return await this.linesheetService.publishLinesheet(linesheetId, user);
  }
}
