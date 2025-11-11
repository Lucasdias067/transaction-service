import { Test, TestingModule } from '@nestjs/testing'
import { PasswordHasherRepository } from 'src/infra/bcrypt/passwordHasher.repository'
import { UserRequestDto } from '../../infra/http/dtos/user.dto'
import { UserEntity } from '../entities/user.entity'
import { UserMapper } from '../mappers/user.mapper'
import { UserRepository } from '../repositories/user.repository'
import { CreateUserUseCase } from './createUser.UseCase'

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase
  let userRepository: jest.Mocked<UserRepository>
  let hashService: jest.Mocked<PasswordHasherRepository>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn()
          }
        },
        {
          provide: 'bcryptService',
          useValue: {
            hash: jest.fn()
          }
        }
      ]
    }).compile()

    useCase = module.get<CreateUserUseCase>(CreateUserUseCase)
    userRepository = module.get(UserRepository)
    hashService = module.get('bcryptService')
  })

  it('should create user successfully', async () => {
    const data: UserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'USER'
    }
    userRepository.findByEmail.mockResolvedValue(null)
    hashService.hash.mockResolvedValue('hashed')
    const user = new UserEntity({
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashed',
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    userRepository.create.mockResolvedValue(user)

    const result = await useCase.execute(data)

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual(UserMapper.toHTTP(user))
  })

  it('should return error if email exists', async () => {
    const data: UserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'USER'
    }
    const existingUser = new UserEntity({
      id: '1',
      name: 'Existing User',
      email: 'test@example.com',
      password: 'hashed',
      role: 'USER',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    userRepository.findByEmail.mockResolvedValue(existingUser)

    const result = await useCase.execute(data)

    expect(result.isLeft()).toBe(true)
    expect((result.value as any).message).toBe('Email already exists')
  })

  it('should return error if creation fails', async () => {
    const data: UserRequestDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      role: 'USER'
    }
    userRepository.findByEmail.mockResolvedValue(null)
    hashService.hash.mockResolvedValue('hashed')
    userRepository.create.mockResolvedValue(null as any)

    const result = await useCase.execute(data)

    expect(result.isLeft()).toBe(true)
    expect((result.value as any).message).toBe('Error on creating user')
  })
})
