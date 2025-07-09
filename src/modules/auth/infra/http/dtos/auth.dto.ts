import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

export class UserLoginRequestDto {
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
}

export class UserLoginResponseDto {
  id: string
  name: string
  email: string
  role: Role
  access_token: string
}
