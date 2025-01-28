import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthEntity } from './auth.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
  ) {
    super({
      secretOrKey: 'topSecret51',
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthEntity> {
    const { username } = payload;
    const user: AuthEntity = await this.authRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new UnauthorizedException('Please check your login credentials');
    }

    return user;
  }
}
