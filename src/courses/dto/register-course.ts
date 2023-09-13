import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CourseDto {
  @IsNotEmpty()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => RecordDto)
  records: RecordDto[];
}

export class RecordDto {
  @IsNotEmpty()
  weekId: string;

  @IsOptional()
  weekName: string;

  @IsArray()
  @ArrayMinSize(1)
  topics: [];
}

export class RegisterCourses {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => CourseDto)
  courses: CourseDto[];
}
