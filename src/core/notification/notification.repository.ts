import { EntityRepository, Repository } from 'typeorm';

import { NotificationEntity } from './notification.entity';

@EntityRepository(NotificationEntity)
export class NotificationRepository extends Repository<NotificationEntity> {}
