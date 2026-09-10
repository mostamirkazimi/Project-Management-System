// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy } from 'passport-jwt';
// import { UsersService } from 'src/users/users.service';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {

//   constructor(
//     private readonly usersService: UsersService,
//   ) {
//     super({
//       jwtFromRequest: (request) => {
//         return request?.cookies?.access_token;
//       },

//       ignoreExpiration: false,

//       secretOrKey:
//         process.env.JWT_SECRET || 'secret',
//     });
//   }

//   async validate(payload: any) {

//     const user =
//       await this.usersService.findOneById(payload.sub);

//     if (!user) {
//       throw new UnauthorizedException(
//         'User not found',
//       );
//     }

//     return {
//       userId: user.id,
//       email: user.email,
//       role: user.role,
//     };
//   }
// }

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

  constructor(
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: (request) => {

        console.log(
          'ACCESS TOKEN FROM COOKIE:',
          request?.cookies?.access_token
        );

        return request?.cookies?.access_token;
      },

      ignoreExpiration: false,

      secretOrKey:
        process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {

    console.log(
      'JWT PAYLOAD:',
      payload
    );

    const user =
      await this.usersService.findOneById(
        payload.sub
      );

    console.log(
      'USER FROM JWT:',
      user
    );

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    return {
      userId: user.id,
      email: user.email,
      role: user.role,
    };
  }
}