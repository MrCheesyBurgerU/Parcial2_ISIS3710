/* eslint-disable prettier/prettier */

import { Repository } from "typeorm";
import { PacienteMedicoService } from "./paciente-medico.service"
import { MedicoEntity } from "../medico/medico.entity";
import { PacienteEntity } from "../paciente/paciente.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmTestingConfig } from "../shared/testing-utils/typeorm-testing-config";
import { getRepositoryToken } from "@nestjs/typeorm";
import { faker } from "@faker-js/faker/.";

describe('PacienteMedicoService', () => {

    let service: PacienteMedicoService;
    let medicoRepository: Repository<MedicoEntity>;
    let pacienteRepository: Repository<PacienteEntity>;
    let paciente: PacienteEntity;
    let medicosList: MedicoEntity[];

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            imports: [...TypeOrmTestingConfig()],
            providers: [PacienteMedicoService],
        }).compile();

        service = module.get<PacienteMedicoService>(PacienteMedicoService);
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

        paciente = await pacienteRepository.save({
            nombre: faker.company.name(),
            genero: faker.person.gender(),
            medicos: medicosList
        });
    };

    it('TutorCursoService should be defined', () => {
        expect(service).toBeDefined();
    });

    it('addMedicoPaciente should add a doctor to a pacient', async () => {
        const newMedico: MedicoEntity = await medicoRepository.save({
            nombre: faker.company.name(),
            especialidad: faker.person.jobTitle(),
            telefono: faker.phone.number()
        });

        const newPaciente: PacienteEntity = await pacienteRepository.save({
            nombre: faker.company.name(),
            genero: faker.person.gender(),
        });

        const result: PacienteEntity = await service.addMedicoPaciente(newPaciente.id, newMedico.id);

        expect(result.medicos.length).toBe(1);
        expect(result.medicos[0]).not.toBeNull();
        expect(result.medicos[0].nombre).toBe(newMedico.nombre);
        expect(result.medicos[0].especialidad).toBe(newMedico.especialidad);
        expect(result.medicos[0].telefono).toBe(newMedico.telefono);
    });

    it('addMedicoPaciente should thrown exception for an invalid Medico', async () => {
        const newPaciente: PacienteEntity = await pacienteRepository.save({
            nombre: faker.company.name(),
            genero: faker.person.gender(),
        });

        await expect(() => service.addMedicoPaciente(newPaciente.id, "0")).rejects.toHaveProperty("message", "The doctor with the given id was not found");
    });

    it('addMedicoPaciente should throw an exception for an invalid pacient', async () => {
        const newMedico: MedicoEntity = await medicoRepository.save({
            nombre: faker.company.name(),
            especialidad: faker.person.jobTitle(),
            telefono: faker.phone.number()
        });

        await expect(() => service.addMedicoPaciente("0", newMedico.id)).rejects.toHaveProperty("message", "The pacient with the given id was not found");
    });

    it('addMedicoPaciente should thrown exception for an invalid pacient (5 doctors)', async () => {
        
        const newMedico: MedicoEntity = await medicoRepository.save({
            nombre: faker.company.name(),
            especialidad: faker.person.jobTitle(),
            telefono: faker.phone.number()
        });

        await expect(() => service.addMedicoPaciente(paciente.id, newMedico.id)).rejects.toHaveProperty("message", "The pacient alredy have 5 doctors");
    });
})
