/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity, PacienteEntity])],
  providers: [PacienteMedicoService]
})
export class PacienteMedicoModule {}
