import { IsEmail, IsEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { BaseDto } from "./base-user.dto";

export class LoginDto extends BaseDto{}