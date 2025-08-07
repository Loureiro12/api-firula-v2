import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserCreationController } from './user-creation.controller';

@Module({
  controllers: [UsersController, UserCreationController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
