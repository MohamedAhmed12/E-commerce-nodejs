import { Stream } from 'stream';

export interface UploadImageInput {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: Stream;
}
