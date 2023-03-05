import { IsString } from "class-validator";

export class VerifyUserDto {
    @IsString()
    signupVerifyToken: string;
}