import { IsNotEmpty } from 'class-validator';

export class CloseEvent {
  @IsNotEmpty()
  time: string;
}
