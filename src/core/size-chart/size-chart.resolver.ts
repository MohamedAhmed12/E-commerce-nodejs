import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { SizeEntity } from 'src/core/size/size.entity';

import { CurrentUser } from '../auth/current-user.decorator';
import { UserEntity } from '../user/user.entity';

import { AddSizeToSizeChartInput } from './inputs/add-size-to-size-chart.input';
import { CreateSizeChartInput } from './inputs/create-size-chart.input';
import { SizeChartEntity } from './size-chart.entity';
import { SizeChartService } from './size-chart.service';

@Resolver()
export class SizeChartResolver {
  constructor(private sizeChartService: SizeChartService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createSizeChart(
    @Args('input') input: CreateSizeChartInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SizeChartEntity> {
    return this.sizeChartService.createSizeChart(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async addSizeToSizeChart(
    @Args('input') input: AddSizeToSizeChartInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SizeChartEntity> {
    return this.sizeChartService.addSizeToSizeChart(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async sizeCharts(
    @Args('subCategoryId') subCategoryId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SizeChartEntity[]> {
    return await this.sizeChartService.querySizeCharts(
      subCategoryId,
      currentUser,
    );
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async sizes(
    @Args('sizeChartId') sizeChartId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<SizeEntity[]> {
    return await this.sizeChartService.querySizes(sizeChartId, currentUser);
  }
}
