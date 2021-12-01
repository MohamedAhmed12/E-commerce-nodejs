export enum EventAction {
  BRAND_CREATED = 'BRAND_CREATED',
  LINESHEET_ARCHIVE = 'LINESHEET_ARCHIVE',
}

export class BrandCreatedEvent {
  brandId: string;
  accountId: string;
}

export class LinesheetArchiveEvent {
  linesheetId: string;
}
