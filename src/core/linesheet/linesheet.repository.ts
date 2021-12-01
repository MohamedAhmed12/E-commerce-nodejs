import { EntityRepository, Repository } from 'typeorm';

import { LinesheetEntity } from './linesheet.entity';

@EntityRepository(LinesheetEntity)
export class LinesheetRepository extends Repository<LinesheetEntity> {}
