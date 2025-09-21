import { Transform } from 'class-transformer'
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword
} from 'class-validator'

export class UserRequestDto {
  /**
   * Nome completo do usuário.
   * @example 'Lucas da Silva'
   */
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string

  /**
   * E-mail único do usuário. Será convertido para minúsculas.
   * @example 'lucas.silva@email.com'
   */
  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @Transform(({ value }) => value.toLowerCase())
  email: string

  /**
   * Senha do usuário.
   * @example 'SenhaForte@123'
   */
  @IsStrongPassword(
    {},
    {
      message:
        'A senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.'
    }
  )
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string

  // O campo 'role' foi REMOVIDO. Atribua 'USER' no seu service ao criar o usuário.
  // Exemplo no service:
  // const newUser = this.userRepository.create({ ...userData, role: 'USER' });

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

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  name: string

  @IsEmail({}, { message: 'O e-mail fornecido é inválido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @Transform(({ value }) => value.toLowerCase())
  email: string

  @IsStrongPassword(
    {},
    {
      message:
        'A senha deve ter no mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo.'
    }
  )
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  password: string
}
