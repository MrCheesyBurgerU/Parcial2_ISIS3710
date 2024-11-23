/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity, PacienteEntity])],
  providers: [MedicoService]
})
export class MedicoModule {}
