/* eslint-disable prettier/prettier */


import { Module } from '@nestjs/common';
import { MedicoService } from './medico.service';
import { MedicoEntity } from './medico.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity])],
  providers: [MedicoService]
})
export class MedicoModule {}
