import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MedicoModule } from './medico/medico.module';
import { PacienteModule } from './paciente/paciente.module';
import { DiagnosticoModule } from './diagnostico/diagnostico.module';

@Module({
  imports: [MedicoModule, PacienteModule, DiagnosticoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
