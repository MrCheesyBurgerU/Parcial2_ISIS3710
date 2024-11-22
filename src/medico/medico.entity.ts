/* eslint-disable prettier/prettier */

import { PacienteEntity } from "../paciente/paciente.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('medico')
export class MedicoEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    nombre: string;

    @Column()
    especialidad: string;

    @Column()
    telefono: string;

    @ManyToMany(() => PacienteEntity, paciente => paciente.medicos)
    pacientes: PacienteEntity[];
}
