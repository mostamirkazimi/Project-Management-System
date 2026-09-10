import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { TaskModule } from './task/task.module';
import { TeamModule } from './team/team.module';
import { BlogModule } from './blog/blog.module';
import { ContactModule } from './contact/contact.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
     ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

     

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),

        autoLoadEntities: true,

        synchronize: true,
      }),
    }),

     

    UsersModule,
    AuthModule,
    ProjectsModule,
    TaskModule,
    TeamModule,
    BlogModule,
    ContactModule

  
  ],
})
export class AppModule {}