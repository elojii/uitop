import { IsArray, IsNumber } from 'class-validator';

export class BulkCompleteDto {
  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}
