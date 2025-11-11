import { INestApplication } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'

describe('App (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('/auth/sign-up (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPass123!',
        role: 'USER'
      })
      .expect(201)
      .expect(res => {
        expect(res.body).toHaveProperty('id')
        expect(res.body.name).toBe('Test User')
        expect(res.body.email).toBe('test@example.com')
        expect(res.body.role).toBe('USER')
      })
  })

  it('/auth/sign-up (POST) - email already exists', () => {
    return request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'StrongPass123!',
        role: 'USER'
      })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toBe('Email already exists')
      })
  })

  afterAll(async () => {
    await app.close()
  })
})
