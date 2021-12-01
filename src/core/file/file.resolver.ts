import { Resolver, Args, Mutation } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

import { AssetUploadUrlAndKey } from 'src/graphql-types';

import { FileService } from './file.service';

@Resolver()
export class FileResolver {
  constructor(private readonly fileService: FileService) {}

  @Mutation(() => AssetUploadUrlAndKey)
  async uploadFile(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { file }: FileUpload,
  ): Promise<AssetUploadUrlAndKey> {
    return this.fileService.uploadFile(file);
  }
}
