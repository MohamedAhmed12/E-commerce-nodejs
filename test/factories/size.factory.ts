import { Injectable } from '@nestjs/common';

import { SizeChartEntity } from '../../src/core/size-chart/size-chart.entity';
import { SizeEntity } from '../../src/core/size/size.entity';
import { SizeService } from '../../src/core/size/size.service';

@Injectable()
export class SizeFactory {
  constructor(private sizeService: SizeService) {}

  async create(name: string, sizeChart: SizeChartEntity): Promise<SizeEntity> {
    return this.sizeService.create(name, sizeChart);
  }
}
