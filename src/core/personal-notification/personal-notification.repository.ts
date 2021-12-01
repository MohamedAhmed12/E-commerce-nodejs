import { EntityRepository, Repository } from 'typeorm';

import { PersonalNotificationEntity } from './personal-notification.entity';

@EntityRepository(PersonalNotificationEntity)
export class PersonalNotificationRepository extends Repository<PersonalNotificationEntity> {}
