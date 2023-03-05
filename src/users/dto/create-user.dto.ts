import { BadRequestException } from "@nestjs/common";
import { Transform } from "class-transformer";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
    // 사용자 이름은 2자이상 30자 이하 문자열
    @Transform(params => params.value.trim())
    @IsString()
    @MinLength(2)
    @MaxLength(30)
    readonly name: string;
    // 사용자 이메일은 60자 이하의 문자열이며 이메일 형식
    @IsString()
    @IsEmail()
    @MaxLength(60)
    readonly email: string;
    // 사용자 패스워드는 영문 대소문자, 숫자 또는 특수문자로 이루어진 8자 이상 30자 이하 문자열
    @Transform(({ value, obj }) => {
        if (obj.password.includes(obj.name.trim())) {
            throw new BadRequestException('비밀번호는 이름과 같은 문자열을 포함하면 안됩니다.');
        }
        return value.trim()
    })
    @IsString()
    @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
    readonly password: string;
}
