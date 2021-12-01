import { EntityRepository, Repository } from 'typeorm';

import { InvitationTokenEntity } from './invitation-token.entity';

@EntityRepository(InvitationTokenEntity)
export class InvitationTokenRepository extends Repository<InvitationTokenEntity> {}
