import {
  Controller,
  Post,
  Body,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  CreateUserSuccessResponseDto,
  CreateUserErrorResponseDto,
  UserResponseDto,
} from './dto/user-response.dto';

@Controller('users')
@ApiTags('User Creation')
export class UserCreationController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user with email validation' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User created successfully',
    type: CreateUserSuccessResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email already exists',
    type: CreateUserErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Validation failed',
    type: CreateUserErrorResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: CreateUserErrorResponseDto,
  })
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserSuccessResponseDto | CreateUserErrorResponseDto> {
    try {
      // Verificar se o email já está cadastrado
      const existingUser = await this.usersService.findByEmail(
        createUserDto.email,
      );

      if (existingUser) {
        return {
          success: false,
          message:
            'Email already exists. Please use a different email address.',
          data: null,
        };
      }

      // Criar o usuário
      const newUser = await this.usersService.create(createUserDto);

      // Remover a senha da resposta por segurança
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = newUser;

      return {
        success: true,
        message: 'User created successfully',
        data: userWithoutPassword as UserResponseDto,
      };
    } catch (error) {
      // Log do erro para debugging (em produção usar um logger apropriado)
      console.error('Error creating user:', error);

      // Verificar se é um erro de constraint unique do banco
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return {
          success: false,
          message:
            'Email already exists. Please use a different email address.',
          data: null,
        };
      }

      // Erro genérico do servidor
      throw new InternalServerErrorException({
        success: false,
        message: 'An unexpected error occurred while creating the user',
        data: null,
      });
    }
  }
}
