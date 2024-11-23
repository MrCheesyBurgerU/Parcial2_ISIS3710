/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagnosticoEntity } from 'src/diagnostico/diagnostico.entity';
import { PacienteController } from './paciente.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PacienteEntity, DiagnosticoEntity])],
  providers: [PacienteService],
  controllers: [PacienteController]
})
export class PacienteModule {}
