import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, Query, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { UserLoginDto } from './dto/login-user.dto';
import { UserInfo } from './UserIfno';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService
    ) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() verifyUserDto: VerifyUserDto): Promise<string> {
    const { signupVerifyToken } = verifyUserDto;
    
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<string> {
    return await this.usersService.login(userLoginDto);
  }

  @Get(':id')
  async getUSerInfo(@Headers() headers: any, @Param('id') id: string): Promise<UserInfo> {
    if(+id < 1) {
      throw new BadRequestException('id는 0보다 커야 합니다.');
    }

    this.authService.verify(jwtString);
    
    return await this.usersService.getUserInfo(id);
  }
}
