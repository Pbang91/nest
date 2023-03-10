import * as uuid from 'uuid';

import { Injectable, InternalServerErrorException, NotFoundException, UnprocessableEntityException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from './../email/email.service';
import { UserLoginDto } from './dto/login-user.dto';
import { UserInfo } from './UserIfno';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
    ) { }
  
  async create(createUserDto: CreateUserDto) {
    const {name, email, password} = createUserDto;

    const userExist = await this.checkUserExists(email);

    if (!userExist) {
      throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);

    return `유저를 등록했습니다. 이름 : ${name}, 이메일 : ${email}`
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken }
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.')
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email
    })
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    const { email, password } = userLoginDto;

    const user = await this.usersRepository.findOne({
      where: { email }
    });

    const validateResult = await this.authService.validatePassword(password, user.password)

    if (!user || validateResult) {
      throw new UnauthorizedException('유저 정보가 올바르지 않습니다.')
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email
    })
  }

  async getUserInfo(id: number): Promise<UserInfo> {
    const user = await this.usersRepository.findOne({
      where: { id: id}
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.')
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
  
  private async checkUserExists(email: string) {
    const user = await this.usersRepository.findOne({
      where: { email: email }
    });
    
    if ( user === null ) {
      return true
    } else {
      return false
    }
  }
  
  private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const user = new UserEntity();
      const hashedPassword = await this.authService.transformPassword(password);
      
      user.name = name;
      user.email = email;
      user.password = hashedPassword;
      user.signupVerifyToken = signupVerifyToken;
      
      await queryRunner.manager.save(user);
      
      // throw new InternalServerErrorException(); //트랜잭션 확인용 코드
      await queryRunner.commitTransaction();

    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제
      await queryRunner.release();
    }
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
  }
}