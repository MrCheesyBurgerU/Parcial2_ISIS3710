/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { PacienteEntity } from './paciente.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussines-errors';

@Injectable()
export class PacienteService {

    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>
    ) {}

    async findAll(): Promise<PacienteEntity[]> {
        return this.pacienteRepository.find({
            relations: [
                "medicos",
                "diagnosticos"
            ]
        });
    }

    async findOne(id: string): Promise<PacienteEntity> {
        const paciente: PacienteEntity = await this.pacienteRepository.findOne({
            where: { id },
            relations: [
                "medicos",
                "diagnosticos"
            ]
        });

        if (!paciente){
            throw new BusinessLogicException(
                "The pacient with the given id was not found",
                BusinessError.NOT_FOUND
            );
        }
        return paciente;
    }

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {

        if( paciente.nombre.length < 3){
            throw new BusinessLogicException(
                "The pacient name is invalid",
                BusinessError.PRECONDITION_FAILED
            );
        }

        return this.pacienteRepository.save(paciente);
    }

    async delete(id: string): Promise<void> {
        const paciente = await this.pacienteRepository.findOne({where: {id}, relations: ["medicos", "diagnosticos"]});

        if (!paciente){
            throw new BusinessLogicException(
                "The pacient with the given id was not found",
                BusinessError.NOT_FOUND
            );
        }

        if(paciente.diagnosticos.length > 0){
            throw new BusinessLogicException(
                "The pacient have at least 1 diagnosis",
                BusinessError.PRECONDITION_FAILED
            );
        }

        await this.pacienteRepository.remove(paciente);
    }
}
