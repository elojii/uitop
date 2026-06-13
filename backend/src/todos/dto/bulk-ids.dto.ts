import { IsArray, IsNumber } from 'class-validator';

export class BulkIdsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
