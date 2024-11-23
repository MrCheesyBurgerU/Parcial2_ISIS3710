/* eslint-disable prettier/prettier */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteService } from './paciente.service';
import { PacienteEntity } from './paciente.entity';
import { faker } from '@faker-js/faker';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

describe('PacienteService', () => {
    let service: PacienteService;
    let pacienteRepository: Repository<PacienteEntity>;
    let diagnosticoRepository: Repository<DiagnosticoEntity>;
    let pacientesList: PacienteEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [PacienteService],
        }).compile();

        service = module.get<PacienteService>(PacienteService);
        pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
        diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
        await seedDatabase();
    });

    const seedDatabase = async () => {
        await pacienteRepository.clear();
        await diagnosticoRepository.clear();
        pacientesList = [];

        for (let i = 0; i < 5; i++) {
            const paciente: PacienteEntity = await pacienteRepository.save({
                nombre: faker.company.name(),
                genero: faker.person.gender(),
            });
            pacientesList.push(paciente);
        }
    };
  
    it('pacienteService should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should return all pacients', async () => {
        const pacientes: PacienteEntity[] = await service.findAll();
        expect(pacientes).not.toBeNull();
        expect(pacientes).toHaveLength(pacientesList.length);
    });

    it('findOne should return a pacient by id', async () => {
        const storedPaciente: PacienteEntity = pacientesList[0];
        const paciente: PacienteEntity = await service.findOne(storedPaciente.id);
        expect(paciente).not.toBeNull();
        expect(paciente.nombre).toEqual(storedPaciente.nombre);
        expect(paciente.genero).toEqual(storedPaciente.genero);
    });

    it('findOne should throw an exception for an invalid pacient', async () => {
        await expect(() => service.findOne('0')).rejects.toHaveProperty(
            'message',
            'The pacient with the given id was not found',
        );
    });

    it('create should return a new pacient', async () => {
        const paciente: PacienteEntity = {
            id: '',
            nombre: faker.company.name(),
            genero: faker.person.gender(),
            medicos: [],
            diagnosticos: []
        };

        const newPaciente: PacienteEntity = await service.create(paciente);
        expect(newPaciente).not.toBeNull();

        const storedPaciente: PacienteEntity = await pacienteRepository.findOne({ where: { id: newPaciente.id } });
        expect(storedPaciente).not.toBeNull();
        expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
        expect(storedPaciente.genero).toEqual(newPaciente.genero);
    });

    it('create should throw an exception for an invalid pacient name', async () => {
        const paciente: PacienteEntity = {
            id: '',
            nombre: "ab",
            genero: faker.person.gender(),
            medicos: [],
            diagnosticos: []
        };
    
        await expect(() => service.create(paciente)).rejects.toHaveProperty(
            "message",
            "The pacient name is invalid"
        );
    });

    it('delete should remove a pacient', async () => {
        const paciente: PacienteEntity = pacientesList[0];
        await service.delete(paciente.id);
        const deletedPaciente: PacienteEntity = await pacienteRepository.findOne({ where: { id: paciente.id } });
        expect(deletedPaciente).toBeNull();
    });

    it('delete should throw an exception for an invalid pacient', async () => {
        await expect(() => service.delete('0')).rejects.toHaveProperty(
            'message',
            'The pacient with the given id was not found',
        );
    });

    it('delete should throw an exception for an invalid pacient (with diagnosis)', async () => {

        const newDiagnostico: DiagnosticoEntity = await diagnosticoRepository.save({
            nombre: faker.lorem.words(),
            descripcion: faker.lorem.words(50)
        });

        const newPaciente: PacienteEntity = await pacienteRepository.save({
            nombre: faker.company.name(),
            genero: faker.person.gender(),
            diagnosticos: [newDiagnostico]
        })

        await expect(() => service.delete(newPaciente.id)).rejects.toHaveProperty(
            'message',
            'The pacient have at least 1 diagnosis',
        );
    });
});