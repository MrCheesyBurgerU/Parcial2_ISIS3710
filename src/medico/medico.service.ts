/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from './medico.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussines-errors';

@Injectable()
export class MedicoService {

    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ) {}

    async findAll(): Promise<MedicoEntity[]> {
        return this.medicoRepository.find({
            relations: [
                "pacientes"
            ]
        });
    }

    async findOne(id: string): Promise<MedicoEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({
            where: { id },
            relations: [
                "pacientes"
            ]
        });

        if (!medico){
            throw new BusinessLogicException(
                "The doctor with the given id was not found",
                BusinessError.NOT_FOUND
            );
        }
        return medico;
    }

    async create(medico: MedicoEntity): Promise<MedicoEntity> {

        if( medico.nombre === "" || medico.nombre === " "){
            throw new BusinessLogicException(
                "The doctor name is invalid",
                BusinessError.PRECONDITION_FAILED
            );
        }

        if( medico.especialidad === "" || medico.especialidad === " "){
            throw new BusinessLogicException(
                "The doctor speciality is invalid",
                BusinessError.PRECONDITION_FAILED
            );
        }

        return this.medicoRepository.save(medico);
    }

    async delete(id: string): Promise<void> {
        const medico = await this.medicoRepository.findOne({where: {id}, relations: ["pacientes"]});

        if (!medico){
            throw new BusinessLogicException(
                "The doctor with the given id was not found",
                BusinessError.NOT_FOUND
            );
        }

        if(medico.pacientes.length > 0){
            throw new BusinessLogicException(
                "The doctor have at least 1 pacient",
                BusinessError.PRECONDITION_FAILED
            );
        }

        await this.medicoRepository.remove(medico);
    }
}
