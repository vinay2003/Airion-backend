import { IsString, IsNotEmpty } from 'class-validator';

export class ReplyTicketDto {
    @IsString()
    @IsNotEmpty()
    reply: string;
}
