import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator'

export class UserLoginRequestDto {
  /**
   * O e-mail de login do usuário.
   * @example 'exemplo@email.com'
   */
  @IsEmail(
    {},
    {
      message: validationArguments =>
        `O e-mail '${validationArguments.value}' é inválido.`
    }
  )
  email: string

  /**
   * A senha do usuário para login.
   * Deve conter pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número e 1 símbolo.
   * @example 'Senha@123'
   */
  @IsNotEmpty({ message: 'A senha não pode estar vazia.' })
  @IsStrongPassword(
    {
      minLength: 8, // Você pode customizar as regras aqui se quiser
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    },
    {
      message:
        'A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula, um número e um símbolo.'
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
