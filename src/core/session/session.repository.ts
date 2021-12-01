import { EntityRepository, Repository } from 'typeorm';

import { SessionEntity } from './session.entity';

@EntityRepository(SessionEntity)
export class SessionRepository extends Repository<SessionEntity> {}
