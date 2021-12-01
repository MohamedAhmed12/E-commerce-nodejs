import { Injectable } from '@nestjs/common';
import { validate } from 'class-validator';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { ProductSubCategoryEntity } from 'src/core/product-sub-category/product-sub-category.entity';
import { ProductSubCategoryService } from 'src/core/product-sub-category/product-sub-category.service';
import { SizeEntity } from 'src/core/size/size.entity';
import { SizeService } from 'src/core/size/size.service';
import { UserEntity } from 'src/core/user/user.entity';

import { AddSizeToSizeChartInput } from './inputs/add-size-to-size-chart.input';
import { CreateSizeChartInput } from './inputs/create-size-chart.input';
import { SizeChartEntity } from './size-chart.entity';
import { SizeChartRepository } from './size-chart.repository';

@Injectable()
export class SizeChartService {
  constructor(
    private readonly sizeChartRepository: SizeChartRepository,
    private readonly subCategoryService: ProductSubCategoryService,
    private readonly sizeService: SizeService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findOne(id: string): Promise<SizeChartEntity> {
    return this.sizeChartRepository.findOne(id);
  }

  async findOneOrThrowError(id: string): Promise<SizeChartEntity> {
    const sizeChart = await this.findOne(id);

    if (!sizeChart) {
      throw new Error(`Size chart with id="${id}" does not exist`);
    }

    return sizeChart;
  }

  async findOneByIdAndSubCategoryId(
    id: string,
    productSubCategoryId,
  ): Promise<SizeChartEntity> {
    return this.sizeChartRepository.findOne({
      id,
      productSubCategory: {
        id: productSubCategoryId,
      },
    });
  }

  async create(
    name: string,
    subCategory: ProductSubCategoryEntity,
  ): Promise<SizeChartEntity> {
    const sizeChart = new SizeChartEntity();
    sizeChart.name = name;
    sizeChart.productSubCategory = subCategory;

    const errors = await validate(sizeChart);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.sizeChartRepository.save(sizeChart);
  }

  async findOneByNameAndSubCategoryId(
    name: string,
    subCategoryId: string,
  ): Promise<SizeChartEntity> {
    return this.sizeChartRepository.findOne({
      name,
      productSubCategory: {
        id: subCategoryId,
      },
    });
  }

  async findOrCreate(
    name: string,
    subCategory: ProductSubCategoryEntity,
  ): Promise<SizeChartEntity> {
    const sizeChart = await this.findOneByNameAndSubCategoryId(
      name,
      subCategory.id,
    );

    if (sizeChart) {
      return sizeChart;
    }

    return this.create(name, subCategory);
  }

  async createSizeChart(
    input: CreateSizeChartInput,
    currentUser: UserEntity,
  ): Promise<SizeChartEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to createSizeChart');
    }

    const subCategory = await this.subCategoryService.findOneOrThrowError(
      input.subCategoryId,
    );

    let sizeChart = await this.findOneByNameAndSubCategoryId(
      input.sizeChartName,
      subCategory.id,
    );

    if (sizeChart) {
      throw new Error(
        `SizeChart with name="${input.sizeChartName}" exist in sub-category with id="${subCategory.id}"`,
      );
    }

    sizeChart = await this.create(input.sizeChartName, subCategory);

    await Promise.all(
      input.sizes.map((sizeName: string) => {
        return this.sizeService.create(sizeName, sizeChart);
      }),
    );

    return this.findOne(sizeChart.id);
  }

  async addSizeToSizeChart(
    input: AddSizeToSizeChartInput,
    currentUser: UserEntity,
  ): Promise<SizeChartEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to createSizeChart');
    }

    const sizeChart = await this.findOneOrThrowError(input.sizeChartId);

    const size = await this.sizeService.findOneByNameAndSizeChartId(
      input.sizeName,
      sizeChart.id,
    );

    if (size) {
      throw new Error(
        `Size with name="${input.sizeName}" exist in sizeChart with id="${sizeChart.id}"`,
      );
    }

    await this.sizeService.create(input.sizeName, sizeChart);

    return await this.findOne(input.sizeChartId);
  }

  async findBySubCategoryId(subCategoryId: string): Promise<SizeChartEntity[]> {
    await this.subCategoryService.findOneOrThrowError(subCategoryId);

    const sizeCharts = await this.sizeChartRepository.find({
      productSubCategory: {
        id: subCategoryId,
      },
    });

    return sizeCharts;
  }

  async querySizeCharts(
    subCategoryId: string,
    currentUser: UserEntity,
  ): Promise<SizeChartEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, SizeChartEntity)) {
      throw new Error('You are not authorized to querySizeCharts');
    }

    return this.findBySubCategoryId(subCategoryId);
  }

  async findSizesBySizeChartId(sizeChartId: string): Promise<SizeEntity[]> {
    await this.findOneOrThrowError(sizeChartId);

    return this.sizeService.findBySizeChartId(sizeChartId);
  }

  async querySizes(
    sizeChartId: string,
    currentUser: UserEntity,
  ): Promise<SizeEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, SizeEntity)) {
      throw new Error('You are not authorized to querySizes');
    }

    return this.findSizesBySizeChartId(sizeChartId);
  }
}
