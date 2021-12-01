import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DateTime } from 'luxon';
import { SelectQueryBuilder } from 'typeorm';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { BrandEntity } from 'src/core/brand/brand.entity';
import { BrandService } from 'src/core/brand/brand.service';
import { isSystemUser } from 'src/core/user/user.helper';
import { EventAction, LinesheetArchiveEvent } from 'src/events/common.event';
import {
  ChangeSequenceNoOfLinesheets,
  LinesheetsQuery,
  SequenceNoOfLinesheet,
} from 'src/graphql-types';

import { CaslAction } from '../../common/casl/casl.constants';
import { UserEntity } from '../user/user.entity';

import { CreateLinesheetInput } from './inputs/create-linesheet.input';
import { EditLinesheetInput } from './inputs/edit-linesheet.input';
import { MinSequenceNo } from './linesheet.constants';
import { LinesheetEntity } from './linesheet.entity';
import { LinesheetRepository } from './linesheet.repository';

interface LinesheetWithNewPriorities {
  linesheet: LinesheetEntity;
  sequenceNo: number;
}

@Injectable({})
export class LinesheetService {
  constructor(
    private readonly linesheetRepository: LinesheetRepository,
    private readonly brandService: BrandService,
    private eventEmitter: EventEmitter2,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async findOneByIdAndBrandId(
    linesheetId: string,
    brandId: string,
  ): Promise<LinesheetEntity> {
    // const query = this.linesheetRepository
    //   .createQueryBuilder('linesheet')
    //   .innerJoinAndSelect('linesheet.brand', 'brand')
    //   .where('linesheet.id = :linesheetId', { linesheetId });
    //
    // if (brandId) {
    //   query.andWhere('brand.id = :brandId', { brandId });
    // }
    //
    // return query.getOne();

    return this.linesheetRepository.findOne({
      id: linesheetId,
      brand: {
        id: brandId,
      },
    });
  }

  async findOneByIdAndBrandIdOrThrowError(
    linesheetId: string,
    brandId: string,
  ): Promise<LinesheetEntity> {
    const linesheet = await this.findOneByIdAndBrandId(linesheetId, brandId);

    if (!linesheet) {
      throw new Error(
        `Linesheet with id="${linesheetId}" does not exist in brand with id="${brandId}"`,
      );
    }

    return linesheet;
  }

  async findOne(id: string): Promise<LinesheetEntity> {
    return this.linesheetRepository.findOne(id);
  }

  async findOneOrThrowError(id: string): Promise<LinesheetEntity> {
    const linesheet = await this.findOne(id);

    if (!linesheet) {
      throw new Error(`Linesheet with id=${id} does not exists`);
    }

    return linesheet;
  }

  async create(
    brand: BrandEntity,
    title: string,
    description?: string,
  ): Promise<LinesheetEntity> {
    const { maxSequenceNo } = await this.linesheetRepository
      .createQueryBuilder('linesheet')
      .innerJoinAndSelect('linesheet.brand', 'brand')
      .where('brand.id = :brandId', { brandId: brand.id })
      .select('MAX(linesheet.sequenceNo)', 'maxSequenceNo')
      .getRawOne();

    const sequenceNo = maxSequenceNo ? maxSequenceNo + 1 : MinSequenceNo;

    const linesheet = new LinesheetEntity();
    linesheet.title = title;
    linesheet.sequenceNo = sequenceNo;
    linesheet.brand = brand;

    if (description !== undefined) {
      linesheet.description = description;
    }

    return this.linesheetRepository.save(linesheet);
  }

  async createLinesheet(
    input: CreateLinesheetInput,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.CREATE, LinesheetEntity)) {
      throw new Error('You are not authorized to create a linesheet');
    }

    let brand;

    if (isSystemUser(currentUser)) {
      brand = await this.brandService.findOneOrThrowError(input.brandId);
    } else {
      brand = await this.brandService.findOneByIdAndAccountIdOrThrowError(
        input.brandId,
        currentUser.account.id,
      );
    }

    return this.create(brand, input.title, input.description);
  }

  getBaseQueryForFindLinesheets(
    input: LinesheetsQuery,
  ): SelectQueryBuilder<LinesheetEntity> {
    const query = this.linesheetRepository
      .createQueryBuilder('linesheet')
      .innerJoinAndSelect('linesheet.brand', 'brand');

    if (input.brandId) {
      query.where('brand.id = :brandId', { brandId: input.brandId });
    }

    query.orderBy('linesheet.sequenceNo', 'DESC');

    return query;
  }

  async getLinesheets(
    input: LinesheetsQuery,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, LinesheetEntity)) {
      throw new Error('You are not authorized to read a linesheets');
    }

    const query = this.getBaseQueryForFindLinesheets(input);

    query.andWhere('brand.publishedAt is not null');

    return query.getMany();
  }

  async getMyLinesheets(
    input: LinesheetsQuery,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ_MY, LinesheetEntity)) {
      throw new Error('You are not authorized to read a linesheets');
    }

    const query = this.getBaseQueryForFindLinesheets(input);

    query
      .innerJoinAndSelect('brand.account', 'account')
      .andWhere('account.id = :accountId', {
        accountId: currentUser.account.id,
      });

    return query.getMany();
  }

  async getSystemLinesheets(
    input: LinesheetsQuery,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to read a linesheets');
    }

    const query = this.getBaseQueryForFindLinesheets(input);

    return query.getMany();
  }

  async getLinesheet(
    id: string,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    const linesheet = await this.findOneOrThrowError(id);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, linesheet)) {
      throw new Error('You are not authorized to read a linesheet');
    }

    return linesheet;
  }

  async edit(
    input: EditLinesheetInput,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    const linesheet = await this.findOneOrThrowError(input.id);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, linesheet)) {
      throw new Error('You are not authorized to edit this linesheets');
    }

    linesheet.title = input.title || linesheet.title;
    linesheet.description = input.description || linesheet.description;

    return this.linesheetRepository.save(linesheet);
  }

  async changeSequenceNoOfLinesheets(
    input: ChangeSequenceNoOfLinesheets,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity[]> {
    const linesheetsWithNewSequenceNo: LinesheetWithNewPriorities[] =
      await Promise.all(
        input.sequenceNoOfLinesheets.map(
          async ({ id, sequenceNo }: SequenceNoOfLinesheet) => {
            const linesheet = await this.findOneByIdAndBrandIdOrThrowError(
              id,
              input.brandId,
            );

            if (sequenceNo < MinSequenceNo) {
              throw new Error(
                `SequenceNo cannot be less than ${MinSequenceNo}`,
              );
            }

            const ability = this.caslAbilityFactory.createForUser(currentUser);

            if (!ability.can(CaslAction.UPDATE, linesheet)) {
              throw new Error(
                'You are not authorized to changeSequenceNoOfLinesheets',
              );
            }

            return {
              linesheet,
              sequenceNo,
            };
          },
        ),
      );

    return await Promise.all(
      linesheetsWithNewSequenceNo.map(
        async ({ linesheet, sequenceNo }: LinesheetWithNewPriorities) => {
          linesheet.sequenceNo = sequenceNo;

          return this.linesheetRepository.save(linesheet);
        },
      ),
    );
  }

  async archive(id: string, currentUser: UserEntity): Promise<LinesheetEntity> {
    const linesheet = await this.findOneOrThrowError(id);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, linesheet)) {
      throw new Error('You are not authorized to archive linesheets');
    }

    linesheet.archivedAt = DateTime.local();

    const linesheetArchiveEvent = new LinesheetArchiveEvent();
    linesheetArchiveEvent.linesheetId = linesheet.id;

    this.eventEmitter.emit(
      EventAction.LINESHEET_ARCHIVE,
      linesheetArchiveEvent,
    );

    return this.linesheetRepository.save(linesheet);
  }

  async publishLinesheet(
    linesheetId: string,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    const linesheet = await this.linesheetRepository.findOne({
      relations: ['products', 'brand'],
      where: {
        id: linesheetId,
      },
    });

    if (!linesheet) {
      throw new Error(`Linesheet with id="${linesheetId}" does not exist`);
    }

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, linesheet)) {
      throw new Error('You are not authorized to publish linesheets');
    }

    if (!linesheet.brand.publishedAt) {
      throw new Error(
        `You cannot publish linesheet with id="${linesheetId}"
        because brand with id="${linesheet.brand.id}" is not published`,
      );
    }

    if (!linesheet.products?.length) {
      throw new Error(
        `You cannot publish linesheet with id="${linesheetId}" because it has no products`,
      );
    }

    linesheet.isPublished = true;

    return this.linesheetRepository.save(linesheet);
  }

  async unPublishLinesheet(
    linesheetId: string,
    currentUser: UserEntity,
  ): Promise<LinesheetEntity> {
    const linesheet = await this.findOneOrThrowError(linesheetId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, linesheet)) {
      throw new Error('You are not authorized to unPublish linesheets');
    }

    linesheet.isPublished = false;

    return this.linesheetRepository.save(linesheet);
  }
}
