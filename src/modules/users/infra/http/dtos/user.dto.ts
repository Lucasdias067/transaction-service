import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword
} from 'class-validator'

export class UserRequestDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsStrongPassword(
    {},
    {
      message:
        'Senha deve conter pelo menos 8 caracteres, incluindo maiúscula, minúscula, número e símbolo'
    }
  )
  password: string

  @IsString()
  @IsNotEmpty()
  role: 'USER'
}

export class UserResponseDto {
  id: string
  name: string
  email: string
  role: Role
}
