import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { SignupDto } from '../auth/dto/signup.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async findByUsername(username: string) {
    const user = await this.userModel
      .findOne()
      .where('username')
      .equals(username);
    return user;
  }

  async create(signupDto: SignupDto) {
    return this.userModel.create(signupDto);
  }
}
