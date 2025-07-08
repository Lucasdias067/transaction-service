import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

export class JwtModules {
  static forRoot() {
    return JwtModule.registerAsync({
      global: true,
      useFactory: () => ({
        secret: process.env.JWT_SECRET_KEY,
        signOptions: { expiresIn: '1h' }
      }),
      inject: [ConfigService]
    })
  }
}
