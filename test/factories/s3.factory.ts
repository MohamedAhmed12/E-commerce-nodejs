import { Injectable } from '@nestjs/common';

import { S3Service } from '../../src/common/s3/s3.service';

@Injectable()
export class S3Factory {
  constructor(private s3Service: S3Service) {}

  getFileUrlByKey(key: string): string {
    return this.s3Service.getFileUrlByKey(key);
  }
}
