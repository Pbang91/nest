import * as uuid from 'uuid';

import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from './../email/email.service';
import { UserLoginDto } from './dto/login-user.dto';
import { UserInfo } from './UserIfno';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService){}
  
  async create(createUserDto: CreateUserDto) {
    const {name, email, password} = createUserDto;

    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);

    return `유저를 등록했습니다. 이름 : ${name}, 이메일 : ${email}`
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    //TODO DB연동 후 구현
    // 1. DB에서 signupVerifyToken으로 회원가입 처리 중인 유저가 있는지 조회하고 없으면 에러 처리
    // 2. 바로 로그인 상태가 되도록 JWT를 발급
    
    throw new Error('Method not implemented.');
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    //TODO DB연동 후 구현
    // 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. JWT를 발급

    const { email, password } = userLoginDto;

    throw new Error('Method not implemented');
  }

  async getUserInfo(id: string): Promise<UserInfo> {
    //TODO
    // 1. userId를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
    // 2. 조회된 데이터를 UserInfo 타입으로 응답

    throw new Error('Method not implemented');
  }
  //TODO DB연동 후 구현
  private checkUserExists(email: string) {
    return false;
  }
  //TODO DB연동 후 구현
  private saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    return;
  }
  //TODO DB연동 후 구현
  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}