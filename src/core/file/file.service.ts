import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload';

import { S3Service } from 'src/common/s3/s3.service';
import { AssetUploadUrlAndKey } from 'src/graphql-types';

@Injectable()
export class FileService {
  constructor(private readonly s3Service: S3Service) {}

  async uploadFile(file: FileUpload): Promise<AssetUploadUrlAndKey> {
    return await this.s3Service.upload(file);
  }
}
