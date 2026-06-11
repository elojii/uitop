import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsNumber()
  categoryId: number;
}
