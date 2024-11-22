/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicoEntity } from '../medico/medico.entity';
import { PacienteEntity } from '../paciente/paciente.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/bussines-errors';

@Injectable()
export class PacienteMedicoService {

    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>,

        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ) {}

    async addMedicoPaciente(idPaciente: string, idMedico: string): Promise<PacienteEntity> {
        const medico: MedicoEntity = await this.medicoRepository.findOne({where: {id: idMedico}})
        if(!medico){
            throw new BusinessLogicException(
                "The doctor with the given id was not found",
                BusinessError.NOT_FOUND
            );
        }

        const paciente: PacienteEntity = await this.pacienteRepository.findOne({where: {id: idPaciente}})
        if(!paciente){
            throw new BusinessLogicException(
                "The pacient with the given id was not found",
                BusinessError.NOT_FOUND
            );
        }

        if (paciente.medicos.length > 4) {
            throw new BusinessLogicException(
                "The pacient alredy have 5 doctors",
                BusinessError.PRECONDITION_FAILED
            );
        }

        paciente.medicos = [...paciente.medicos, medico]
        return await this.pacienteRepository.save(paciente);
    }
}
