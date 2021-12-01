import { EntityRepository, Repository } from 'typeorm';

import { ResetPasswordTokenEntity } from './reset-password-token.entity';

@EntityRepository(ResetPasswordTokenEntity)
export class ResetPasswordTokenRepository extends Repository<ResetPasswordTokenEntity> {}
