import { EntityRepository, Repository } from 'typeorm';

import { SizeChartEntity } from './size-chart.entity';

@EntityRepository(SizeChartEntity)
export class SizeChartRepository extends Repository<SizeChartEntity> {}
