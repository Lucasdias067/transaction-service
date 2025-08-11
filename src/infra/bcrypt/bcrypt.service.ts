import { Injectable } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { PasswordHasherRepository } from './passwordHasher.repository'

@Injectable()
export class BcryptService implements PasswordHasherRepository {
  async hash(plainPassword: string, salt: number): Promise<string> {
    return await bcrypt.hash(plainPassword, salt)
  }

  async compare(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword)
  }
}
