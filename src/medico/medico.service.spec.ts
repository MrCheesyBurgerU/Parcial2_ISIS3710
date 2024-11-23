/* eslint-disable prettier/prettier */

import { Repository } from "typeorm";
import { MedicoService } from "./medico.service"
import { MedicoEntity } from "./medico.entity";
import { PacienteEntity } from "../paciente/paciente.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from '@faker-js/faker';

describe('MedicoService', () => {
    let service: MedicoService;
    let medicoRepository: Repository<MedicoEntity>;
    let pacienteRepository: Repository<PacienteEntity>;
    let medicosList: MedicoEntity[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [MedicoService]
        }).compile();

        service = module.get<MedicoService>(MedicoService);
        medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
        pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
        await seedDatabase();
    });

    const seedDatabase = async () => {
        await medicoRepository.clear();
        await pacienteRepository.clear();
        medicosList = [];

        for (let i = 0; i < 5; i++) {
            const medico: MedicoEntity = await medicoRepository.save({
                nombre: faker.company.name(),
                especialidad: faker.person.jobTitle(),
                telefono: faker.phone.number()
            });
            medicosList.push(medico);
        }
    };
  
    it('medicoService should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findAll should return all doctors', async () => {
        const medicos: MedicoEntity[] = await service.findAll();
        expect(medicos).not.toBeNull();
        expect(medicos).toHaveLength(medicosList.length);
    });

    it('findOne should return a doctor by id', async () => {
        const storedMedico: MedicoEntity = medicosList[0];
        const medico: MedicoEntity = await service.findOne(storedMedico.id);
        expect(medico).not.toBeNull();
        expect(medico.nombre).toEqual(storedMedico.nombre);
        expect(medico.especialidad).toEqual(storedMedico.especialidad);
        expect(medico.telefono).toEqual(storedMedico.telefono);
    });

    it('findOne should throw an exception for an invalid doctor', async () => {
        await expect(() => service.findOne('0')).rejects.toHaveProperty(
            'message',
            'The doctor with the given id was not found',
        );
    });

    it('create should return a new doctor', async () => {
        const medico: MedicoEntity = {
            id: '',
            nombre: faker.company.name(),
            especialidad: faker.person.jobTitle(),
            telefono: faker.phone.number(),
            pacientes: []
        };

        const newMedico: MedicoEntity = await service.create(medico);
        expect(newMedico).not.toBeNull();

        const storedMedico: MedicoEntity = await medicoRepository.findOne({ where: { id: newMedico.id } });
        expect(storedMedico).not.toBeNull();
        expect(storedMedico.nombre).toEqual(newMedico.nombre);
        expect(storedMedico.especialidad).toEqual(newMedico.especialidad);
        expect(storedMedico.telefono).toEqual(newMedico.telefono);
    });

    it('create should throw an exception for an invalid doctor name', async () => {
        const medico: MedicoEntity = {
            id: '',
            nombre: '',
            especialidad: faker.person.jobTitle(),
            telefono: faker.phone.number(),
            pacientes: []
        };
    
        await expect(() => service.create(medico)).rejects.toHaveProperty(
            "message",
            "The doctor name is invalid"
        );
    });

    it('create should throw an exception for an invalid doctor speciality', async () => {
        const medico: MedicoEntity = {
            id: '',
            nombre: faker.company.name(),
            especialidad: '',
            telefono: faker.phone.number(),
            pacientes: []
        };
    
        await expect(() => service.create(medico)).rejects.toHaveProperty(
            "message",
            "The doctor speciality is invalid"
        );
    });

    it('delete should remove a doctor', async () => {
        const medico: MedicoEntity = medicosList[0];
        await service.delete(medico.id);
        const deletedMedico: MedicoEntity = await medicoRepository.findOne({ where: { id: medico.id } });
        expect(deletedMedico).toBeNull();
    });

    it('delete should throw an exception for an invalid doctor', async () => {
        await expect(() => service.delete('0')).rejects.toHaveProperty(
            'message',
            'The doctor with the given id was not found',
        );
    });

    it('delete should throw an exception for an invalid doctor (with pacients)', async () => {

        const newPaciente: PacienteEntity = await pacienteRepository.save({
            nombre: faker.company.name(),
            genero: faker.person.gender()
        });

        const newMedico: MedicoEntity = await medicoRepository.save({
            nombre: faker.company.name(),
            especialidad: faker.person.jobTitle(),
            telefono: faker.phone.number(),
            pacientes: [newPaciente]
        })

        await expect(() => service.delete(newMedico.id)).rejects.toHaveProperty(
            'message',
            'The doctor have at least 1 pacient',
        );
    });
})