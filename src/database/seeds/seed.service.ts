import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { EnvironmentConfig, SeedsConfig } from 'src/configuration';
import { AccountService } from 'src/core/account/account.service';
import { BadgeService } from 'src/core/badge/badge.service';
import { BrandService } from 'src/core/brand/brand.service';
import { ProductCategoryEntity } from 'src/core/product-category/product-category.entity';
import { ProductCategoryService } from 'src/core/product-category/product-category.service';
import { ProductColorService } from 'src/core/product-color/product-color.service';
import { ProductMaterialsService } from 'src/core/product-materials/product-materials.service';
import { ProductSubCategoryEntity } from 'src/core/product-sub-category/product-sub-category.entity';
import { ProductSubCategoryService } from 'src/core/product-sub-category/product-sub-category.service';
import { RetailersService } from 'src/core/retailers/retailers.service';
import { SizeChartEntity } from 'src/core/size-chart/size-chart.entity';
import { SizeChartService } from 'src/core/size-chart/size-chart.service';
import { SizeService } from 'src/core/size/size.service';
import { UserService } from 'src/core/user/services/user.service';

import {
  PredefinedBrandBadges,
  PredefinedProductCategoriesWithSizeCharts,
  PredefinedProductColors,
} from './predefined-values';
import { BrandBadgesSeeder } from './seeders/brand-badges.seeder';
import { BrandCategoriesSeeder } from './seeders/brand-categories.seeder';
import { BrandKeywordsSeeder } from './seeders/brand-keywords.seeder';
import { CitiesSeeder } from './seeders/cities.seeder';
import { CountriesSeeder } from './seeders/countries.seeder';
import { CurrenciesSeeder } from './seeders/currencies.seeder';
import { GendersSeeder } from './seeders/genders.seeder';
import { PaymentTermsSeeder } from './seeders/payment-terms.seeder';
import { ProductLabelsSeeder } from './seeders/product-labels.seeder';
import { ProductSeasonsSeeder } from './seeders/product-seasons.seeder';
import { ProductStylesSeeder } from './seeders/product-styles.seeder';
import { ProductThemesSeeder } from './seeders/product-themes.seeder';
import { ShippingTermsSeeder } from './seeders/shipping-terms.seeder';
import { UsersSeeder } from './seeders/users.seeder';
import { Brands, Accounts, Retailers } from './seeding-values';

interface IProductCategories {
  name: string;
  subCategories: IProductSubCategories[];
  productMaterials?: string[];
}

interface IProductSubCategories {
  name: string;
  sizeCharts: ISizeChart[];
}

interface ISizeChart {
  name: string;
  sizes: string[];
}

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly systemManagerEmails: string[];
  private readonly badges: string[];
  private readonly productCategoriesWithSizeCharts: IProductCategories[];
  private readonly productColors: string[];
  private readonly isDevelopment: boolean;
  private readonly isSeedingCommand: boolean;

  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,
    private readonly badgeService: BadgeService,
    private readonly productCategoryService: ProductCategoryService,
    private readonly productSubCategoryService: ProductSubCategoryService,
    private readonly productColorService: ProductColorService,
    private readonly sizeChartService: SizeChartService,
    private readonly sizeService: SizeService,
    private readonly brandService: BrandService,
    private readonly accountService: AccountService,
    private readonly retailersService: RetailersService,
    private readonly productMaterialsService: ProductMaterialsService,
    private readonly countriesSeeder: CountriesSeeder,
    private readonly citiesSeeder: CitiesSeeder,
    private readonly gendersSeeder: GendersSeeder,
    private readonly brandCategoriesSeeder: BrandCategoriesSeeder,
    private readonly brandBadgesSeeder: BrandBadgesSeeder,
    private readonly productStylesSeeder: ProductStylesSeeder,
    private readonly productThemesSeeder: ProductThemesSeeder,
    private readonly productSeasonsSeeder: ProductSeasonsSeeder,
    private readonly productLabelsSeeder: ProductLabelsSeeder,
    private readonly shippingTermsSeeder: ShippingTermsSeeder,
    private readonly paymentTermsSeeder: PaymentTermsSeeder,
    private readonly brandKeywordsSeeder: BrandKeywordsSeeder,
    private readonly usersSeeder: UsersSeeder,
    private readonly currenciesSeeder: CurrenciesSeeder,
  ) {
    const { systemManagerEmails } =
      this.configService.get<SeedsConfig>('seeds');
    const { isTesting } = this.configService.get<EnvironmentConfig>('env');
    const { isDevelopment } = this.configService.get<EnvironmentConfig>('env');

    this.systemManagerEmails = systemManagerEmails;
    this.badges = isTesting ? [] : PredefinedBrandBadges;
    this.productCategoriesWithSizeCharts = isTesting
      ? []
      : PredefinedProductCategoriesWithSizeCharts;
    this.productColors = isTesting ? [] : PredefinedProductColors;
    this.isDevelopment = isDevelopment;
    this.isSeedingCommand =
      JSON.parse(process.env.npm_config_argv).original[2] &&
      JSON.parse(process.env.npm_config_argv).original[2] == '--seed';
  }

  async creatOrFindSubCategories(
    subCategoriesData: IProductSubCategories[],
    productCategory: ProductCategoryEntity,
  ) {
    return Promise.all(
      subCategoriesData.map(async (subCategoryData: IProductSubCategories) => {
        const subCategory = await this.productSubCategoryService.findOrCreate(
          subCategoryData.name,
          productCategory,
        );

        await this.createOrFindSizeCharts(
          subCategoryData.sizeCharts,
          subCategory,
        );
      }),
    );
  }

  async createOrFindSizeCharts(
    sizeChartsData: ISizeChart[],
    subCategory: ProductSubCategoryEntity,
  ) {
    return Promise.all(
      sizeChartsData.map(async (sizeChartData: ISizeChart) => {
        const sizeChart = await this.sizeChartService.findOrCreate(
          sizeChartData.name,
          subCategory,
        );

        await this.crateOrFindSizes(sizeChartData.sizes, sizeChart);
      }),
    );
  }

  async crateOrFindSizes(sizesData: string[], sizeChart: SizeChartEntity) {
    return Promise.all(
      sizesData.map(async (size: string) => {
        await this.sizeService.findOrCreate(size, sizeChart);
      }),
    );
  }

  async runDevelopmentSeeders() {
    await Promise.all([
      // Users With Different type of Accounts
      Accounts.map(async (user) => {
        let account = await this.accountService.findOneByName(user.name);

        if (account === undefined) {
          account = await this.accountService.create(
            user.name,
            user.type,
            null,
          );
        }

        // Brands
        Brands.map(async (seedBrand) => {
          const brand = await this.brandService.findOneByName(seedBrand.name);

          if (brand === undefined) {
            await this.brandService.create(
              account,
              seedBrand.name,
              seedBrand.description,
            );
          }
        });
      }),
      // Retailers
      Retailers.map(async (retailer) => {
        await this.retailersService.findOrCreate(
          retailer.name,
          retailer.description,
        );
      }),
      // countries
      await this.countriesSeeder.run(),
      // cities
      await this.citiesSeeder.run(),
      // genders
      await this.gendersSeeder.run(),
      // brand categories
      await this.brandCategoriesSeeder.run(),
      // brand badges
      await this.brandBadgesSeeder.run(),
      // brand keywords
      await this.brandKeywordsSeeder.run(),
      // product themes
      await this.productThemesSeeder.run(),
      // product seasons
      await this.productSeasonsSeeder.run(),
      // product styles
      await this.productStylesSeeder.run(),
      // product labels
      await this.productLabelsSeeder.run(),
      // shipping terms
      await this.shippingTermsSeeder.run(),
      // payment terms
      await this.paymentTermsSeeder.run(),
      // users terms
      await this.usersSeeder.run(),
      // currencies
      await this.currenciesSeeder.run(),
    ]);
  }

  async onApplicationBootstrap() {
    await Promise.all([
      this.systemManagerEmails.map(async (email) => {
        await this.userService.createOrFindSystemUser({ email });
      }),
      this.badges.map(async (badge) => {
        await this.badgeService.findOrCreate(badge);
      }),
      this.productCategoriesWithSizeCharts.map(
        async (productCategoryData: IProductCategories) => {
          const productCategory =
            await this.productCategoryService.findOrCreate(
              productCategoryData.name,
            );

          await this.creatOrFindSubCategories(
            productCategoryData.subCategories,
            productCategory,
          );

          if (productCategoryData.productMaterials) {
            productCategoryData.productMaterials.forEach((material) => {
              this.productMaterialsService.findOrCreate(material, [
                productCategory,
              ]);
            });
          }
        },
      ),
      this.productColors.map(async (color) => {
        await this.productColorService.findOrCreate(color);
      }),
    ]);

    if (this.isDevelopment && this.isSeedingCommand) {
      this.runDevelopmentSeeders();
    }
  }
}
