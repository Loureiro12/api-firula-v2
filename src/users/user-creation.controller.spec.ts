import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { UserCreationController } from './user-creation.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  CreateUserSuccessResponseDto,
  CreateUserErrorResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';

describe('UserCreationController', () => {
  let controller: UserCreationController;

  // Mock data
  const mockCreateUserDto: CreateUserDto = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password123',
  };

  const mockUserWithPassword = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashedPassword123',
    createdAt: new Date('2025-08-06T23:30:40.000Z'),
    updatedAt: new Date('2025-08-06T23:30:40.000Z'),
  };

  const mockUserWithoutPassword: UserResponseDto = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'John Doe',
    email: 'john.doe@example.com',
    createdAt: new Date('2025-08-06T23:30:40.000Z'),
    updatedAt: new Date('2025-08-06T23:30:40.000Z'),
  };

  // Mock UsersService
  const mockUsersService = {
    findByEmail: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCreationController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UserCreationController>(UserCreationController);

    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully when email does not exist', async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUserWithPassword);

      // Act
      const result = await controller.create(mockCreateUserDto);

      // Assert
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(mockCreateUserDto);

      const expectedResponse: CreateUserSuccessResponseDto = {
        success: true,
        message: 'User created successfully',
        data: mockUserWithoutPassword,
      };

      expect(result).toEqual(expectedResponse);
    });

    it('should return error when email already exists (from findByEmail)', async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(mockUserWithPassword);

      // Act
      const result = await controller.create(mockCreateUserDto);

      // Assert
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(mockUsersService.create).not.toHaveBeenCalled();

      const expectedResponse: CreateUserErrorResponseDto = {
        success: false,
        message: 'Email already exists. Please use a different email address.',
        data: null,
      };

      expect(result).toEqual(expectedResponse);
    });

    it('should return error when email already exists (Prisma P2002 error)', async () => {
      // Arrange
      const prismaError = {
        code: 'P2002',
        meta: { target: ['email'] },
        message: 'Unique constraint failed',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockRejectedValue(prismaError);

      // Act
      const result = await controller.create(mockCreateUserDto);

      // Assert
      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(mockCreateUserDto);

      const expectedResponse: CreateUserErrorResponseDto = {
        success: false,
        message: 'Email already exists. Please use a different email address.',
        data: null,
      };

      expect(result).toEqual(expectedResponse);
    });

    it('should throw InternalServerErrorException for unexpected errors', async () => {
      // Arrange
      const unexpectedError = new Error('Database connection failed');

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(controller.create(mockCreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should log error when unexpected error occurs', async () => {
      // Arrange
      const unexpectedError = new Error('Database connection failed');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockRejectedValue(unexpectedError);

      // Act & Assert
      await expect(controller.create(mockCreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating user:',
        unexpectedError,
      );

      // Cleanup
      consoleSpy.mockRestore();
    });

    it('should handle Prisma error with different target (not email)', async () => {
      // Arrange
      const prismaError = {
        code: 'P2002',
        meta: { target: ['username'] }, // Different target, not email
        message: 'Unique constraint failed',
      };

      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockRejectedValue(prismaError);

      // Act & Assert
      await expect(controller.create(mockCreateUserDto)).rejects.toThrow(
        InternalServerErrorException,
      );

      expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
        mockCreateUserDto.email,
      );
      expect(mockUsersService.create).toHaveBeenCalledWith(mockCreateUserDto);
    });

    it('should remove password from response data', async () => {
      // Arrange
      mockUsersService.findByEmail.mockResolvedValue(null);
      mockUsersService.create.mockResolvedValue(mockUserWithPassword);

      // Act
      const result = (await controller.create(
        mockCreateUserDto,
      )) as CreateUserSuccessResponseDto;

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).not.toHaveProperty('password');
      expect(result.data).toEqual(mockUserWithoutPassword);
    });
  });
});
