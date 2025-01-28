import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { AuthCredentialsDto } from './dto/authCredentials.dto';
import { Auth } from './auth.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  async signIn(@Body() authCredentialsDto: AuthCredentialsDto) {
    return await this.authService.signIn(authCredentialsDto);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<Auth> {
    const user = await this.authService.findUserById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get('user/:username')
  async getUserByUsername(@Param('username') username: string): Promise<Auth> {
    return this.authService.findUserByUsername(username);
  }
}
