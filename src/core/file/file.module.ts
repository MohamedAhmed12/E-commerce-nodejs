import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { S3Module } from 'src/common/s3/s3.module';

import { FileEntity } from './file.entity';
import { FileResolver } from './file.resolver';
import { FileService } from './file.service';

@Module({
  providers: [FileResolver, FileService],
  imports: [TypeOrmModule.forFeature([FileEntity]), S3Module],
  exports: [],
})
export class FileModule {}
