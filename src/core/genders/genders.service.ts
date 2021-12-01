import { Injectable } from '@nestjs/common';

import { GenderEntity } from './gender.entity';
import { GenderRepository } from './gender.repository';

@Injectable()
export class GendersService {
  constructor(private readonly genderRepository: GenderRepository) {}

  async create(name: string): Promise<GenderEntity> {
    const gender = new GenderEntity();
    gender.name = name;
    return await this.genderRepository.save(gender);
  }

  async findAll(): Promise<GenderEntity[]> {
    return await this.genderRepository.find();
  }

  async findOne(id: string): Promise<GenderEntity> {
    return await this.genderRepository.findOne(id);
  }
}
