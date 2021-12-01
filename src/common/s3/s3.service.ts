import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { FileUpload } from 'graphql-upload';
import { v4 as uuidv4 } from 'uuid';

import { S3Config } from 'src/configuration';
import { AssetUploadUrlAndKey } from 'src/graphql-types';

@Injectable()
export class S3Service {
  private s3: S3;
  private readonly bucket: string;
  private readonly region: string;

  constructor(private readonly configService: ConfigService) {
    const { bucket, region } = this.configService.get<S3Config>('s3');

    this.s3 = new S3({
      signatureVersion: 'v4',
    });

    this.bucket = bucket;
    this.region = region;
  }

  generateUniqueName(): string {
    return uuidv4();
  }

  // getSignedUrlAndKey(
  //   key: string = this.generateUniqueName(),
  //   expireSeconds: number = 60 * 5,
  // ): AssetUploadUrlAndKey {
  //   const url = this.s3.getSignedUrl('putObject', {
  //     Bucket: this.bucket,
  //     Key: key,
  //     Expires: expireSeconds,
  //   });

  //   return { url, key };
  // }

  async upload(
    file: FileUpload,
    key: string = this.generateUniqueName(),
  ): Promise<AssetUploadUrlAndKey> {
    const { Location } = await this.s3
      .upload({
        Bucket: this.bucket,
        Key: key,
        Body: file.createReadStream(),
        ACL: 'public-read',
        ContentEncoding: 'base64', // required
        ContentType: file.mimetype, // required. Notice the back ticks
      })
      .promise();

    return { url: Location, key };
  }

  getFileUrlByKey(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }

  async delete(Key: string): Promise<boolean> {
    const res = await this.s3
      .deleteObject({
        Bucket: this.bucket,
        Key,
      })
      .promise();

    return res.DeleteMarker;
  }
}
