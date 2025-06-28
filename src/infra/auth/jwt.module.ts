import { JwtModule } from '@nestjs/jwt'

export class JwtModules {
  static forRoot() {
    return JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1h' }
    })
  }
}
