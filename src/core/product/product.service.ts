import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { validate } from 'class-validator';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';

import { CaslAbilityFactory } from 'src/common/casl/casl-ability.factory';
import { CaslAction } from 'src/common/casl/casl.constants';
import { S3Service } from 'src/common/s3/s3.service';
import { BrandEntity } from 'src/core/brand/brand.entity';
import { BrandService } from 'src/core/brand/brand.service';
import { LinesheetEntity } from 'src/core/linesheet/linesheet.entity';
import { LinesheetService } from 'src/core/linesheet/linesheet.service';
import { ProductColorEntity } from 'src/core/product-color/product-color.entity';
import { ProductColorService } from 'src/core/product-color/product-color.service';
import { ProductSubCategoryService } from 'src/core/product-sub-category/product-sub-category.service';
import { SizeChartEntity } from 'src/core/size-chart/size-chart.entity';
import { SizeChartService } from 'src/core/size-chart/size-chart.service';
import { SizeEntity } from 'src/core/size/size.entity';
import { SizeService } from 'src/core/size/size.service';
import { UserEntity } from 'src/core/user/user.entity';
import { isSystemUser } from 'src/core/user/user.helper';
import { EventAction, LinesheetArchiveEvent } from 'src/events/common.event';
import {
  AssignProductToLinesheetInput,
  // ProductImage,
  Product,
  ProductsQuery,
} from 'src/graphql-types';

import { CreateProductInput } from './inputs/create-product.input';
import { EditProductInput } from './inputs/edit-product.input';
import { ProductEntity } from './product.entity';
import { ProductRepository } from './product.repository';

@Injectable({})
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly linesheetService: LinesheetService,
    private readonly brandService: BrandService,
    private readonly productColorService: ProductColorService,
    private readonly productSubCategoryService: ProductSubCategoryService,
    private readonly sizeChartService: SizeChartService,
    private readonly sizeService: SizeService,
    private caslAbilityFactory: CaslAbilityFactory,
    private s3Service: S3Service,
  ) {}

  async findOne(id: string): Promise<ProductEntity> {
    return this.productRepository.findOne(id);
  }

  async findOneOrThrowError(id: string): Promise<ProductEntity> {
    const product = await this.findOne(id);

    if (!product) {
      throw new Error(`Product with id="${id}" does not exist`);
    }

    return product;
  }

  // createImageUrls(imageId: string): ProductImages {
  //   const originUrl = this.s3Service.getFileUrlByKey(imageId);

  //   return {
  //     origin: originUrl,
  //   };
  // }

  // transformProductEntityToProduct(productEntity: ProductEntity): Product {
  //   const previewImageUrls = this.createImageUrls(
  //     productEntity.previewImageId,
  //   );

  //   const imagesUrls = productEntity.imageIds.map((imageId: string) =>
  //     this.createImageUrls(imageId),
  //   );

  //   return {
  //     ...productEntity,
  //     previewImageUrls,
  //     imagesUrls,
  //   };
  // }

  // transformProductEntitiesToProducts(
  //   productEntities: ProductEntity[],
  // ): Product[] {
  //   return productEntities.map((productEntity: ProductEntity) =>
  //     this.transformProductEntityToProduct(productEntity),
  //   );
  // }

  getBaseQueryForFindProducts(
    input: ProductsQuery = {},
  ): SelectQueryBuilder<ProductEntity> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .innerJoinAndMapMany(
        'product.productColors',
        'product.productColors',
        'productColors',
      )
      .innerJoinAndSelect('product.brand', 'brand')
      .innerJoinAndSelect('product.productSubCategory', 'productSubCategory')
      .innerJoinAndSelect(
        'productSubCategory.productCategory',
        'productCategory',
      )
      .innerJoinAndSelect('product.sizeChart', 'sizeChart')
      .innerJoinAndSelect('product.selectedSizes', 'selectedSizes');

    // ToDo: add linesheet to response

    if (input.linesheetId) {
      query.innerJoinAndSelect('product.linesheet', 'linesheet');
      query.andWhere('linesheet.id = :linesheetId', {
        linesheetId: input.linesheetId,
      });
    }

    if (input.brandId) {
      query.andWhere('brand.id = :brandId', { brandId: input.brandId });
    }

    if (input.productCategoryId) {
      query.andWhere('productCategory.id = :productCategoryId', {
        productCategoryId: input.productCategoryId,
      });
    }

    if (input.productSubCategoryId) {
      query.andWhere('productSubCategory.id = :productSubCategoryId', {
        productSubCategoryId: input.productSubCategoryId,
      });
    }

    return query;
  }

  async getProducts(
    input: ProductsQuery,
    currentUser: UserEntity,
  ): Promise<Product[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, ProductEntity)) {
      throw new Error('You are not authorized to read products');
    }

    const query = this.getBaseQueryForFindProducts(input);

    if (!input.linesheetId) {
      query.innerJoinAndSelect('product.linesheet', 'linesheet');
    }

    query.andWhere('brand.publishedAt is not null');
    query.andWhere('linesheet.isPublished = :isPublishedLinesheet', {
      isPublishedLinesheet: true,
    });

    const products = await query.getMany();

    // return this.transformProductEntitiesToProducts(products);
    return products;
  }

  async getMyProducts(
    input: ProductsQuery,
    currentUser: UserEntity,
  ): Promise<Product[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ_MY, ProductEntity)) {
      throw new Error('You are not authorized to read products');
    }

    const query = this.getBaseQueryForFindProducts(input);

    query.andWhere('brand.account.id = :accountId', {
      accountId: currentUser.account.id,
    });

    const products = await query.getMany();

    // return this.transformProductEntitiesToProducts(products);
    return products;
  }

  async getSystemProducts(
    input: ProductsQuery,
    currentUser: UserEntity,
  ): Promise<Product[]> {
    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to read products');
    }

    const query = this.getBaseQueryForFindProducts(input);
    const products = await query.getMany();

    // return this.transformProductEntitiesToProducts(products);
    return products;
  }

  async getProduct(
    productId: string,
    currentUser: UserEntity,
  ): Promise<Product> {
    const query = this.getBaseQueryForFindProducts();

    query.andWhere('product.id = :productId', { productId });
    query.andWhere('brand.publishedAt is not null');
    query.innerJoinAndSelect('product.linesheet', 'linesheet');
    query.andWhere('linesheet.isPublished = :isPublishedLinesheet', {
      isPublishedLinesheet: true,
    });

    const product = await query.getOne();

    if (!product) {
      throw new Error(`Product with id="${productId}" does not exist`);
    }

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ, product)) {
      throw new Error('You are not authorized to read product');
    }

    // return this.transformProductEntityToProduct(product);
    return product;
  }

  async getMyProduct(
    productId: string,
    currentUser: UserEntity,
  ): Promise<Product> {
    const query = this.getBaseQueryForFindProducts();

    query.andWhere('product.id = :productId', { productId });
    query.andWhere('brand.account.id = :accountId', {
      accountId: currentUser.account.id,
    });
    query.innerJoinAndSelect('product.linesheet', 'linesheet');

    const product = await query.getOne();

    if (!product) {
      throw new Error(
        `Product with id="${productId}" does not exist in your account`,
      );
    }

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.READ_MY, product)) {
      throw new Error('You are not authorized to read products');
    }

    // return this.transformProductEntityToProduct(product);
    return product;
  }

  async getSystemProduct(
    productId: string,
    currentUser: UserEntity,
  ): Promise<Product> {
    const product = await this.findOneOrThrowError(productId);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.MANAGE, 'all')) {
      throw new Error('You are not authorized to read products');
    }

    // return this.transformProductEntityToProduct(product);
    return product;
  }

  async getAndValidateColors(
    colorIds: string[],
  ): Promise<ProductColorEntity[]> {
    const productColors = await this.productColorService.findByIds(colorIds);

    if (colorIds.length !== productColors.length) {
      throw new Error(
        'Length of found colors in database does not match with passed product colors',
      );
    }

    return productColors;
  }

  async getAndValidateSizeChartAndSizes(
    sizeChartId: string,
    subCategoryIs: string,
    selectedSizesIds: string[],
  ): Promise<{ sizeChart: SizeChartEntity; selectedSizes: SizeEntity[] }> {
    const sizeChart = await this.sizeChartService.findOneByIdAndSubCategoryId(
      sizeChartId,
      subCategoryIs,
    );

    if (!sizeChart) {
      throw new Error(
        `Size chart with id=${sizeChartId} does not exists
        in sub-category with id="${subCategoryIs}"`,
      );
    }

    const selectedSizes = await this.sizeService.findByIdsAndSizeChartId(
      selectedSizesIds,
      sizeChart.id,
    );

    if (selectedSizesIds.length !== selectedSizes.length) {
      throw new Error(
        'Length of found sizes in database does not match with passed selected sizes',
      );
    }

    return {
      sizeChart,
      selectedSizes,
    };
  }

  async create(
    input: CreateProductInput,
    brand: BrandEntity,
  ): Promise<ProductEntity> {
    const subCategory =
      await this.productSubCategoryService.findOneOrThrowError(
        input.productSubCategoryId,
      );

    const productColors = await this.getAndValidateColors(input.colorIds);

    const { sizeChart, selectedSizes } =
      await this.getAndValidateSizeChartAndSizes(
        input.sizeChartId,
        subCategory.id,
        input.selectedSizesIds,
      );

    const product = new ProductEntity();

    product.name = input.name;
    product.referenceCode = input.referenceCode;
    product.wholesalePrice = input.wholesalePrice;
    product.retailPrice = input.retailPrice;
    product.currencyId = input.currencyId;
    product.description = input.description;
    product.material = input.material;
    product.minQuantity = input.minQuantity;
    product.previewImages = input.previewImages;
    product.images = input.images;

    if (input.tags) {
      product.tags = input.tags;
    }

    product.productColors = productColors;
    product.brand = brand;
    product.productSubCategory = subCategory;
    product.sizeChart = sizeChart;
    product.selectedSizes = selectedSizes;

    const errors = await validate(product);

    if (errors.length > 0) {
      throw new Error(`Validation failed!`);
    }

    return this.productRepository.save(product);
  }

  async createProduct(
    input: CreateProductInput,
    currentUser: UserEntity,
  ): Promise<Product> {
    let brand;

    if (isSystemUser(currentUser)) {
      brand = await this.brandService.findOneOrThrowError(input.brandId);
    } else {
      brand = await this.brandService.findOneByIdAndAccountIdOrThrowError(
        input.brandId,
        currentUser.account.id,
      );
    }

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.CREATE, ProductEntity)) {
      throw new Error('You are not authorized to create products');
    }

    const product = await this.create(input, brand);

    // return this.transformProductEntityToProduct(product);
    return product;
  }

  async edit(
    input: EditProductInput,
    currentUser: UserEntity,
  ): Promise<Product> {
    const product = await this.findOneOrThrowError(input.id);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, product)) {
      throw new Error('You are not authorized to edit product');
    }

    if (input.productSubCategoryId) {
      const subCategory =
        await this.productSubCategoryService.findOneOrThrowError(
          input.productSubCategoryId,
        );

      product.productSubCategory = subCategory;
    }

    product.name = input.name || product.name;
    product.referenceCode = input.referenceCode || product.referenceCode;
    product.wholesalePrice = input.wholesalePrice || product.wholesalePrice;
    product.retailPrice = input.retailPrice || product.retailPrice;
    product.currencyId = input.currencyId || product.currencyId;
    product.description = input.description || product.description;
    product.material = input.material || product.material;
    product.minQuantity = input.minQuantity || product.minQuantity;
    product.tags = input.tags || product.tags;
    product.previewImages = input.previewImages || product.previewImages;

    if (input.images !== undefined) {
      product.images = input.images;
    }

    if (input.colorIds) {
      const productColors = await this.getAndValidateColors(input.colorIds);

      product.productColors = productColors;
    }

    if (input.sizeChartId && !input.selectedSizesIds) {
      throw new Error('Provide selectedSizesIds');
    }

    if (!input.sizeChartId && input.selectedSizesIds) {
      throw new Error('Provide sizeChartId');
    }

    if (input.sizeChartId && input.selectedSizesIds) {
      const subCategoryId =
        input.productSubCategoryId || product.productSubCategory.id;

      const { sizeChart, selectedSizes } =
        await this.getAndValidateSizeChartAndSizes(
          input.sizeChartId,
          subCategoryId,
          input.selectedSizesIds,
        );

      product.sizeChart = sizeChart;
      product.selectedSizes = selectedSizes;
    }

    const editedProduct = await this.productRepository.save(product);

    // return this.transformProductEntityToProduct(editedProduct);
    return editedProduct;
  }

  async assignProductToLinesheet(
    product: ProductEntity,
    linesheet: LinesheetEntity,
  ): Promise<ProductEntity> {
    product.linesheet = linesheet;

    return this.productRepository.save(product);
  }

  async assignProductToLinesheetWithAbility(
    input: AssignProductToLinesheetInput,
    currentUser: UserEntity,
  ): Promise<Product> {
    const product = await this.findOneOrThrowError(input.productId);

    const linesheet =
      await this.linesheetService.findOneByIdAndBrandIdOrThrowError(
        input.linesheetId,
        product.brand.id,
      );

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.UPDATE, product)) {
      throw new Error('You are not authorized to assignProductToLinesheet');
    }

    const editedProduct = await this.assignProductToLinesheet(
      product,
      linesheet,
    );

    // return this.transformProductEntityToProduct(editedProduct);
    return editedProduct;
  }

  async archive(id: string, currentUser: UserEntity): Promise<UpdateResult> {
    const product = await this.findOneOrThrowError(id);

    const ability = this.caslAbilityFactory.createForUser(currentUser);

    if (!ability.can(CaslAction.DELETE, product)) {
      throw new Error('You are not authorized to assignProductToLinesheet');
    }

    return this.productRepository.softDelete(product.id);
  }

  @OnEvent(EventAction.LINESHEET_ARCHIVE, { async: true })
  async handleArchiveLinesheetEvent(payload: LinesheetArchiveEvent) {
    const query = this.getBaseQueryForFindProducts({
      linesheetId: payload.linesheetId,
    });

    const products = await query.getMany();

    await Promise.all(
      products.map(async (product) => {
        product.linesheet = null;

        return this.productRepository.save(product);
      }),
    );
  }

  async findOneAvailableProduct(productId: string): Promise<ProductEntity> {
    const product = this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :productId', { productId })
      .innerJoinAndSelect('product.productColors', 'productColors')
      .innerJoinAndSelect('product.selectedSizes', 'selectedSizes')
      .innerJoinAndSelect('product.brand', 'brand')
      .andWhere('brand.publishedAt is not null')
      .innerJoinAndSelect('product.linesheet', 'linesheet')
      .andWhere('linesheet.isPublished = :isPublishedLinesheet', {
        isPublishedLinesheet: true,
      })
      .getOne();

    return product;
  }

  async findOneAvailableProductOrThrowError(
    productId: string,
  ): Promise<ProductEntity> {
    const product = this.findOneAvailableProduct(productId);

    if (!product) {
      throw new Error(`Product with id="${productId}" does not exist`);
    }

    return product;
  }
}
