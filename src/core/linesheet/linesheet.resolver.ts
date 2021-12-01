import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';

import { CurrentUser } from 'src/core/auth/current-user.decorator';
import { GqlAuthGuard } from 'src/core/auth/guards/gql-auth.guard';
import { UserEntity } from 'src/core/user/user.entity';
import {
  ChangeSequenceNoOfLinesheets,
  LinesheetsQuery,
} from 'src/graphql-types';

import { CreateLinesheetInput } from './inputs/create-linesheet.input';
import { EditLinesheetInput } from './inputs/edit-linesheet.input';
import { LinesheetEntity } from './linesheet.entity';
import { LinesheetService } from './linesheet.service';

@Resolver()
export class LinesheetResolver {
  constructor(private readonly linesheetService: LinesheetService) {}

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async createLinesheet(
    @Args('input') input: CreateLinesheetInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    return this.linesheetService.createLinesheet(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async linesheets(
    @Args('input') input: LinesheetsQuery,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    return this.linesheetService.getLinesheets(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async myLinesheets(
    @Args('input') input: LinesheetsQuery,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    return this.linesheetService.getMyLinesheets(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async systemLinesheets(
    @Args('input') input: LinesheetsQuery,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    return this.linesheetService.getSystemLinesheets(input, currentUser);
  }

  @Query()
  @UseGuards(GqlAuthGuard)
  async linesheet(
    @Args('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    return this.linesheetService.getLinesheet(id, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async editLinesheet(
    @Args('input') input: EditLinesheetInput,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    return this.linesheetService.edit(input, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async changeSequenceNoOfLinesheets(
    @Args('input') input: ChangeSequenceNoOfLinesheets,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    return this.linesheetService.changeSequenceNoOfLinesheets(
      input,
      currentUser,
    );
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async archiveLinesheet(
    @Args('id') id: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    return this.linesheetService.archive(id, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async publishLinesheet(
    @Args('linesheetId') linesheetId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    return this.linesheetService.publishLinesheet(linesheetId, currentUser);
  }

  @Mutation()
  @UseGuards(GqlAuthGuard)
  async unPublishLinesheet(
    @Args('linesheetId') linesheetId: string,
    @CurrentUser() currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    return this.linesheetService.unPublishLinesheet(linesheetId, currentUser);
  }
}
