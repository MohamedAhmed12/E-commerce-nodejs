import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from 'src/core/user/services/user.service';
import { UserEntity } from 'src/core/user/user.entity';

import { jwtConstants } from '../constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any): Promise<UserEntity> {
    const { sub: userId } = payload;

    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
