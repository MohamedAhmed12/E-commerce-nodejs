import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { SizeChartEntity } from 'src/core/size-chart/size-chart.entity';

import { SizeEntity } from './size.entity';
import { SizeRepository } from './size.repository';

@Injectable()
export class SizeService {
  constructor(private readonly sizeRepository: SizeRepository) {}

  async findOne(id: string): Promise<SizeEntity> {
    return this.sizeRepository.findOne(id);
  }

  async create(name: string, sizeChart: SizeChartEntity): Promise<SizeEntity> {
    const size = new SizeEntity();
    size.name = name;
    size.sizeChart = sizeChart;

    const errors = await validate(size);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.sizeRepository.save(size);
  }

  async findOneByNameAndSizeChartId(
    name: string,
    sizeChartId: string,
  ): Promise<SizeEntity> {
    return this.sizeRepository.findOne({
      name,
      sizeChart: {
        id: sizeChartId,
      },
    });
  }

  async findOrCreate(
    name: string,
    sizeChart: SizeChartEntity,
  ): Promise<SizeEntity> {
    const size = await this.findOneByNameAndSizeChartId(name, sizeChart.id);

    if (size) {
      return size;
    }

    return this.create(name, sizeChart);
  }

  async findByIdsAndSizeChartId(
    sizeIds: string[],
    sizeChartId: string,
  ): Promise<SizeEntity[]> {
    return this.sizeRepository
      .createQueryBuilder('size')
      .where('size.id IN (:...sizeIds)', { sizeIds })
      .innerJoinAndSelect('size.sizeChart', 'sizeChart')
      .andWhere('sizeChart.id = :sizeChartId', { sizeChartId })
      .getMany();
  }

  async findBySizeChartId(sizeChartId: string): Promise<SizeEntity[]> {
    return this.sizeRepository.find({
      relations: ['sizeChart'],
      where: {
        sizeChart: {
          id: sizeChartId,
        },
      },
    });
  }
}
