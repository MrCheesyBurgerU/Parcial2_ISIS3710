/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from 'src/paciente/paciente.entity';
import { MedicoController } from './medico.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity, PacienteEntity])],
  providers: [MedicoService],
  controllers: [MedicoController]
})
export class MedicoModule {}
