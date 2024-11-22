/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { DiagnosticoService } from './diagnostico.service';
import { DiagnosticoEntity } from './diagnostico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DiagnosticoEntity])],
  providers: [DiagnosticoService]
})
export class DiagnosticoModule {}
