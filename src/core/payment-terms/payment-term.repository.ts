import { EntityRepository, Repository } from 'typeorm';

import { PaymentTermEntity } from './payment-term.entity';

@EntityRepository(PaymentTermEntity)
export class PaymentTermRepository extends Repository<PaymentTermEntity> {}
