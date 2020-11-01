import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TasksModule } from './tasks/tasks.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
