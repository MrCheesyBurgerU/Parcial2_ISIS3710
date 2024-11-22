/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagnosticoEntity } from './diagnostico.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/bussines-errors';

@Injectable()
export class DiagnosticoService {

    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>
    ){}

    async findAll(): Promise<DiagnosticoEntity[]> {
        return await this.diagnosticoRepository.find({
            relations: [
                'pacientes'
            ]
        });
    }

    async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico = await this.diagnosticoRepository.findOne({
            where: { id }, 
            relations: [
                'pacientes'
            ]
        });

        if (!diagnostico) {
            throw new BusinessLogicException(
                "The diagnosis with the given id was not found", 
                BusinessError.NOT_FOUND
            );
        }
        return diagnostico;
    }

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        
        if (diagnostico.descripcion.length > 200) {
            throw new BusinessLogicException(
                "The diagnosis description is invalid", 
                BusinessError.PRECONDITION_FAILED
            );
        }

        return await this.diagnosticoRepository.save(diagnostico);
    }

    async delete(id: string): Promise<void> {

        const diagnostico = await this.diagnosticoRepository.findOne({where: { id }, relations: ['pacientes']});

        if (!diagnostico) {
            throw new BusinessLogicException(
                "The diagnosis with the given id was not found", 
                BusinessError.NOT_FOUND
            );
        }
        
        await this.diagnosticoRepository.remove(diagnostico);
    }
}