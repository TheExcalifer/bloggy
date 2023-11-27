import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UserRole } from '../users/enum/user.enum';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<object> {
    const errorMessage = 'Username or password is invalid';
    const user = await this.userService.findByUsername(loginDto.username);

    if (!user) throw new UnauthorizedException(errorMessage);

    // * Hash Password
    const correctPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!correctPassword) throw new UnauthorizedException(errorMessage);

    // * JWT Token Implementation
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
    };

    // * JWT Access Token
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signup(signupDto: SignupDto): Promise<void> {
    try {
      // * Bcrypt
      const salt = 10;
      const hash = await bcrypt.hash(signupDto.password, salt);

      // * Create User
      await this.userService.create({
        ...signupDto,
        role: UserRole.REGULAR,
        password: hash,
      });
    } catch (error) {
      if (error.code === 11000) throw new ConflictException('Username exist.');
    }
  }
}
