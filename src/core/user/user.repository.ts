import { SubjectClass } from '@casl/ability';
import { EntityRepository, Repository } from 'typeorm';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';

import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async can(user: UserEntity, abilityType: CaslAction, entity: SubjectClass) {
    const caslAbilityFactory = new CaslAbilityFactory();
    const ability = caslAbilityFactory.createForUser(user);

    if (!ability.can(abilityType, entity)) {
      throw new Error('You are not authorized to do this Action!');
    }
  }
}
