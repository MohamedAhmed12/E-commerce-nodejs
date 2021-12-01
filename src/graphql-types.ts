
/*
 * ------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

import _BigNumber from 'bignumber.js'

export enum AccountType {
    BRAND_ACCOUNT = "BRAND_ACCOUNT",
    SHOWROOM = "SHOWROOM",
    RETAILER = "RETAILER",
    MEDIA = "MEDIA",
    CONSUMER = "CONSUMER",
    INFLUENCER = "INFLUENCER"
}

export enum CustomResponseStatus {
    OK = "OK"
}

export enum NotificationEntityType {
    USER = "USER",
    ACCOUNT = "ACCOUNT",
    BRAND = "BRAND"
}

export enum NotificationActionType {
    CREATE = "CREATE"
}

export enum AbilityType {
    SYSTEM_MANAGER = "SYSTEM_MANAGER",
    SYSTEM_OPERATOR = "SYSTEM_OPERATOR",
    ACCOUNT_MANAGER = "ACCOUNT_MANAGER",
    ACCOUNT_OPERATOR = "ACCOUNT_OPERATOR",
    BRAND_ADMIN = "BRAND_ADMIN",
    BRAND_CREATOR = "BRAND_CREATOR",
    RETAILER_BUYER = "RETAILER_BUYER"
}

export class EditAccountInput {
    accountId: string;
    name?: string;
}

export class SystemAccountsInput {
    type?: AccountType;
}

export class CreateBrandInput {
    accountId: string;
    name: string;
    description?: string;
}

export class EditBrandInput {
    id: string;
    name?: string;
    description?: string;
}

export class SizeIdWithQuantityInput {
    sizeId: string;
    quantity: number;
}

export class CreateCartItemInput {
    productId: string;
    productColorId?: string;
    sizeIdsWithQuantity: SizeIdWithQuantityInput[];
}

export class EditCartItemInput {
    cartItemId: string;
    productColorId?: string;
    sizeIdsWithQuantity?: SizeIdWithQuantityInput[];
}

export class BulkCreateCityInput {
    name: string;
    countryId: number;
}

export class BulkCreateCountryInput {
    name: string;
}

export class CreateLinesheetInput {
    brandId: string;
    title: string;
    description?: string;
}

export class LinesheetsQuery {
    brandId?: string;
}

export class EditLinesheetInput {
    id: string;
    title?: string;
    description?: string;
}

export class ChangeSequenceNoOfLinesheets {
    brandId: string;
    sequenceNoOfLinesheets: SequenceNoOfLinesheet[];
}

export class SequenceNoOfLinesheet {
    id: string;
    sequenceNo: number;
}

export class ImageSrcInput {
    key: string;
    url: string;
}

export class CreateProductImageInput {
    src: ImageSrcInput;
    order: number;
}

export class AddColorVariationToProductImageInput {
    id: string;
    colorHex: string;
    colorId: string;
}

export class CreateProductInput {
    brandId: string;
    productSubCategoryId: string;
    name: string;
    referenceCode: string;
    wholesalePrice: BigNumber;
    retailPrice: BigNumber;
    currencyId: string;
    description?: string;
    material?: string;
    minQuantity?: number;
    tags?: string[];
    colorIds: string[];
    sizeChartId: string;
    selectedSizesIds: string[];
    previewImages: string[];
    images: CreateProductImageInput[];
}

export class EditProductInput {
    id: string;
    productSubCategoryId?: string;
    name?: string;
    referenceCode?: string;
    wholesalePrice?: BigNumber;
    retailPrice?: BigNumber;
    currencyId: string;
    description?: string;
    material?: string;
    minQuantity?: number;
    tags?: string[];
    colorIds?: string[];
    sizeChartId?: string;
    selectedSizesIds?: string[];
    previewImages?: string[];
    images?: CreateProductImageInput[];
}

export class ProductsQuery {
    brandId?: string;
    linesheetId?: string;
    productCategoryId?: string;
    productSubCategoryId?: string;
}

export class AssignProductToLinesheetInput {
    productId: string;
    linesheetId: string;
}

export class CreateSizeChartInput {
    subCategoryId: string;
    sizeChartName: string;
    sizes: string[];
}

export class AddSizeToSizeChartInput {
    sizeChartId: string;
    sizeName: string;
}

export class InviteAdminInput {
    email: string;
    firstName: string;
    lastName: string;
    abilityType: AbilityType;
}

export class InviteUserToAccountInput {
    accountId: string;
    email: string;
    firstName: string;
    lastName: string;
    abilityType: AbilityType;
}

export class EditProfileInput {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    title?: string;
}

export class RequestAccessToPlatformInput {
    accountType: AccountType;
    email: string;
    companyName: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    country: string;
    website: string;
    dataField?: string;
}

export class SystemUserInfo {
    email: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    emailConfirmedAt?: DateTime;
    abilityType?: AbilityType;
}

export class CreateBrandUserInput {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber?: string;
    title?: string;
    abilityType: AbilityType;
}

export class EditBrandUserInput {
    id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    phoneNumber?: string;
    title?: string;
    abilityType?: AbilityType;
}

export class ChangeBrandUserTypeInput {
    id: string;
    abilityType?: AbilityType;
}

export class Account {
    id: string;
    name: string;
    type: AccountType;
    cart?: Cart;
}

export abstract class IQuery {
    abstract systemAccounts(input?: SystemAccountsInput): Account[] | Promise<Account[]>;

    abstract systemAccount(accountId: string): Account | Promise<Account>;

    abstract myAccount(): Account | Promise<Account>;

    abstract badges(): Badge[] | Promise<Badge[]>;

    abstract BrandBadges(): BrandBadge[] | Promise<BrandBadge[]>;

    abstract BrandBadge(id: string): BrandBadge | Promise<BrandBadge>;

    abstract brandCategories(): BrandCategory[] | Promise<BrandCategory[]>;

    abstract brandCategory(id: string): BrandCategory | Promise<BrandCategory>;

    abstract brandKeywords(): BrandKeyword[] | Promise<BrandKeyword[]>;

    abstract brandKeyword(id: string): BrandKeyword | Promise<BrandKeyword>;

    abstract brand(brandId: string): Brand | Promise<Brand>;

    abstract brands(accountId?: string): Brand[] | Promise<Brand[]>;

    abstract systemBrands(accountId?: string): Brand[] | Promise<Brand[]>;

    abstract myBrands(): Brand[] | Promise<Brand[]>;

    abstract favouriteBrands(): Brand[] | Promise<Brand[]>;

    abstract myCartItems(): CartItem[] | Promise<CartItem[]>;

    abstract cities(): City[] | Promise<City[]>;

    abstract city(id: number): City | Promise<City>;

    abstract _empty(): string | Promise<string>;

    abstract countries(): Country[] | Promise<Country[]>;

    abstract country(id: number): Country | Promise<Country>;

    abstract currencies(): Currency[] | Promise<Currency[]>;

    abstract genders(): Gender[] | Promise<Gender[]>;

    abstract gender(id: string): Gender | Promise<Gender>;

    abstract linesheets(input: LinesheetsQuery): Linesheet[] | Promise<Linesheet[]>;

    abstract myLinesheets(input: LinesheetsQuery): Linesheet[] | Promise<Linesheet[]>;

    abstract systemLinesheets(input: LinesheetsQuery): Linesheet[] | Promise<Linesheet[]>;

    abstract linesheet(id: string): Linesheet | Promise<Linesheet>;

    abstract notifications(): Notification[] | Promise<Notification[]>;

    abstract paymentTerms(): PaymentTerm[] | Promise<PaymentTerm[]>;

    abstract personalNotifications(): PersonalNotification[] | Promise<PersonalNotification[]>;

    abstract productCategories(): ProductCategory[] | Promise<ProductCategory[]>;

    abstract productCategory(id: string): ProductCategory | Promise<ProductCategory>;

    abstract productColors(): ProductColor[] | Promise<ProductColor[]>;

    abstract productLabels(): ProductLabel[] | Promise<ProductLabel[]>;

    abstract productMaterials(): ProductMaterial[] | Promise<ProductMaterial[]>;

    abstract productSeasons(): ProductSeason[] | Promise<ProductSeason[]>;

    abstract productStyles(): ProductStyle[] | Promise<ProductStyle[]>;

    abstract productSubCategories(): ProductSubCategory[] | Promise<ProductSubCategory[]>;

    abstract productThemes(): ProductTheme[] | Promise<ProductTheme[]>;

    abstract products(input: ProductsQuery): Product[] | Promise<Product[]>;

    abstract myProducts(input: ProductsQuery): Product[] | Promise<Product[]>;

    abstract systemProducts(input: ProductsQuery): Product[] | Promise<Product[]>;

    abstract product(productId: string): Product | Promise<Product>;

    abstract myProduct(productId: string): Product | Promise<Product>;

    abstract systemProduct(productId: string): Product | Promise<Product>;

    abstract retailers(): Retailer[] | Promise<Retailer[]>;

    abstract retailer(id: number): Retailer | Promise<Retailer>;

    abstract shippingTerms(): ShippingTerm[] | Promise<ShippingTerm[]>;

    abstract sizeCharts(subCategoryId: string): SizeShart[] | Promise<SizeShart[]>;

    abstract sizes(sizeChartId: string): Size[] | Promise<Size[]>;

    abstract me(): User | Promise<User>;
}

export abstract class IMutation {
    abstract createAccount(name: string, type: AccountType): Account | Promise<Account>;

    abstract editAccount(input?: EditAccountInput): Account | Promise<Account>;

    abstract acceptInvite(inviteToken: string, password: string): AuthResponse | Promise<AuthResponse>;

    abstract signInWithEmail(email: string, password: string): AuthResponse | Promise<AuthResponse>;

    abstract requestPasswordResetWithEmail(email: string): CustomResponse | Promise<CustomResponse>;

    abstract finalizePasswordReset(token: string, password: string): AuthResponse | Promise<AuthResponse>;

    abstract signOut(): CustomResponse | Promise<CustomResponse>;

    abstract refreshSession(refreshToken: string): AuthResponse | Promise<AuthResponse>;

    abstract createBrand(input: CreateBrandInput): Brand | Promise<Brand>;

    abstract editBrand(input: EditBrandInput): Brand | Promise<Brand>;

    abstract assignBadge(brandId: string, badgeId: string): Brand | Promise<Brand>;

    abstract publishBrand(brandId: string): Brand | Promise<Brand>;

    abstract deactivateBrand(brandId: string): CustomResponse | Promise<CustomResponse>;

    abstract createCartItem(input: CreateCartItemInput): CartItem | Promise<CartItem>;

    abstract editCartItem(input: EditCartItemInput): CartItem | Promise<CartItem>;

    abstract removeCartItem(cartItemId: string): CustomResponse | Promise<CustomResponse>;

    abstract _empty(): string | Promise<string>;

    abstract createFavouriteBrand(brandId: string): Brand | Promise<Brand>;

    abstract removeBrandFromFavourites(brandId: string): CustomResponse | Promise<CustomResponse>;

    abstract uploadFile(file?: FileUpload): AssetUploadUrlAndKey | Promise<AssetUploadUrlAndKey>;

    abstract createLinesheet(input: CreateLinesheetInput): Linesheet | Promise<Linesheet>;

    abstract editLinesheet(input: EditLinesheetInput): Linesheet | Promise<Linesheet>;

    abstract changeSequenceNoOfLinesheets(input: ChangeSequenceNoOfLinesheets): Linesheet[] | Promise<Linesheet[]>;

    abstract archiveLinesheet(id: string): Linesheet | Promise<Linesheet>;

    abstract publishLinesheet(linesheetId: string): Linesheet | Promise<Linesheet>;

    abstract unPublishLinesheet(linesheetId: string): Linesheet | Promise<Linesheet>;

    abstract setNotificationAsRead(notificationId: string): PersonalNotification | Promise<PersonalNotification>;

    abstract addColorVariationToProductImage(input: AddColorVariationToProductImageInput): ProductImage | Promise<ProductImage>;

    abstract createProduct(input: CreateProductInput): Product | Promise<Product>;

    abstract editProduct(input: EditProductInput): Product | Promise<Product>;

    abstract assignProductToLinesheet(input: AssignProductToLinesheetInput): Product | Promise<Product>;

    abstract archiveProduct(id: string): CustomResponse | Promise<CustomResponse>;

    abstract createSizeChart(input?: CreateSizeChartInput): SizeShart | Promise<SizeShart>;

    abstract addSizeToSizeChart(input?: AddSizeToSizeChartInput): SizeShart | Promise<SizeShart>;

    abstract inviteAdmins(input?: InviteAdminInput[]): User[] | Promise<User[]>;

    abstract inviteUsersToAccount(input?: InviteUserToAccountInput[]): User[] | Promise<User[]>;

    abstract editProfile(input: EditProfileInput): User | Promise<User>;

    abstract requestAccessToPlatform(input: RequestAccessToPlatformInput): CustomResponse | Promise<CustomResponse>;

    abstract createBrandUser(input: CreateBrandUserInput): User | Promise<User>;

    abstract editBrandUser(input: EditBrandUserInput): User | Promise<User>;

    abstract changeBrandUserType(input: ChangeBrandUserTypeInput): User | Promise<User>;

    abstract deleteBrandUser(id?: string): string | Promise<string>;
}

export class JwtTokenPair {
    accessToken: string;
    refreshToken: string;
}

export class AuthResponse {
    jwt?: JwtTokenPair;
}

export class Badge {
    id: string;
    name: string;
}

export class BrandBadge {
    id: string;
    name: string;
}

export class BrandCategory {
    id: string;
    name: string;
    brands?: Brand[];
}

export class BrandKeyword {
    id: string;
    name: string;
    brand?: Brand[];
}

export class Brand {
    id: string;
    name: string;
    description?: string;
    account: Account;
    operators: User[];
    publishedAt?: DateTime;
    badges?: BrandBadge[];
    categories?: BrandCategory[];
    keywords?: BrandKeyword[];
}

export class CartItem {
    id: string;
    product: Product;
    productColor?: ProductColor;
    quantitiesSizes: QuantitySizes[];
    isAvailable: boolean;
}

export class Cart {
    id: string;
    account: Account;
}

export class City {
    id: string;
    name: string;
    country: Country;
}

export class CustomResponse {
    message: string;
    status: CustomResponseStatus;
}

export class Country {
    id: string;
    name: string;
    cities?: City[];
}

export class Currency {
    id: string;
    name: string;
}

export class AssetUploadUrlAndKey {
    url: ManagedUpload;
    key: string;
}

export class Gender {
    id: string;
    name: string;
    categories?: ProductCategory[];
}

export class Linesheet {
    id: string;
    title: string;
    description?: string;
    brand: Brand;
    sequenceNo: number;
    archivedAt?: DateTime;
    isPublished: boolean;
}

export class Notification {
    id: string;
    entityType: NotificationEntityType;
    actionType: NotificationActionType;
    entityId: string;
}

export class PaymentTerm {
    id: string;
    name: string;
}

export class PersonalNotification {
    id: string;
    readAt?: DateTime;
    notification: Notification;
}

export class ProductCategory {
    id: string;
    name: string;
    gender?: Gender;
    productSubCategories?: ProductSubCategory[];
    productMaterials?: ProductMaterial[];
}

export class ProductColor {
    id: string;
    name: string;
}

export class ImageSrc {
    key: string;
    url: string;
}

export class ProductImage {
    id?: string;
    src: ImageSrc;
    order: number;
    colorHex?: string;
    color?: ProductColor;
    product?: Product;
}

export class ProductLabel {
    id: string;
    name: string;
}

export class ProductMaterial {
    id: string;
    name: string;
    productCategories?: ProductCategory[];
    products?: Product[];
}

export class ProductSeason {
    id: string;
    name: string;
}

export class ProductStyle {
    id: string;
    name: string;
    productSubCategory: ProductSubCategory;
}

export class ProductSubCategory {
    id: string;
    name: string;
    productCategory: ProductCategory;
}

export class ProductTheme {
    id: string;
    name: string;
    products?: Product[];
}

export class Product {
    id: string;
    name: string;
    referenceCode: string;
    wholesalePrice: BigNumber;
    retailPrice: BigNumber;
    description?: string;
    material?: string;
    minQuantity?: number;
    tags?: string[];
    previewImages: string[];
    archivedAt?: DateTime;
    linesheet?: Linesheet;
    currency?: Currency;
    brand: Brand;
    productThemes?: ProductTheme[];
    productColors: ProductColor[];
    productGender: Gender;
    productCategory: ProductCategory;
    productSubCategory: ProductSubCategory;
    productSeason?: ProductSeason;
    sizeChart: SizeShart;
    selectedSizes: Size[];
    images: ProductImage[];
}

export class QuantitySizes {
    id: string;
    cartItem: CartItem;
    size: Size;
    quantity: number;
}

export class Retailer {
    id: string;
    name: string;
    description?: string;
    publishedAt?: DateTime;
}

export class ShippingTerm {
    id: string;
    name: string;
}

export class SizeShart {
    id: string;
    name: string;
    sizes: Size[];
}

export class Size {
    id: string;
    name: string;
    sizeChart: SizeShart;
}

export class User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    title?: string;
    abilityType: AbilityType;
    account?: Account;
}

export type FileUpload = any;
export type DateTime = any;
export type BigNumber = _BigNumber;
export type ManagedUpload = any;
