/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteMedicoController } from './paciente-medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity, PacienteEntity])],
  providers: [PacienteMedicoService],
  controllers: [PacienteMedicoController]
})
export class PacienteMedicoModule {}
