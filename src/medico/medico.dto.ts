/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsString } from "class-validator";

export class MedicoDto {

    @IsString()
    @IsNotEmpty()
    readonly nombre: string;

    @IsString()
    @IsNotEmpty()
    readonly especialidad: string;

    @IsString()
    @IsNotEmpty()
    readonly telefono: string;
}
