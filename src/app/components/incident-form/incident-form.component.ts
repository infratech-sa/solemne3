import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IncidentService } from '../../services/incident.service';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-incident-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './incident-form.component.html',
  styleUrls: ['./incident-form.component.css']
})
export class IncidentFormComponent {
  incident: Incident = {
    id: 0,
    createdAt: new Date(),
    category: '',
    priority: '', 
    title: '',
    description: '',
    openingTime: null,
    closingTime: null,
    assignedTo: null,
    status: 'Abierto',
    resolution: null
  };

  fechaOpcion: string = '';
  fechaManual: string = '';
  fechaActual: string = '';
  isSubmitting: boolean = false;
  connectionStatus: string = 'Verificando conexión...';

  constructor(
    private incidentService: IncidentService,
    private router: Router
  ) {
    this.checkConnection();
  }

  checkConnection(): void {
    this.incidentService.getIncidents().subscribe({
      next: () => {
        this.connectionStatus = '✅ Conectado al servidor';
      },
      error: (error) => {
        console.error('Error de conexión:', error);
        this.connectionStatus = '❌ Sin conexión al servidor';
      }
    });
  }

  onFechaOpcionChange() {
    if (this.fechaOpcion === 'automatica') {
      this.fechaActual = new Date().toLocaleString('es-ES');
    }
  }

onSubmit() {
  if (this.isSubmitting) return;
  
  this.isSubmitting = true;

  // Establecer la fecha según la opción seleccionada
  if (this.fechaOpcion === 'automatica') {
    this.incident.createdAt = new Date();  // fecha y hora actual
    this.incident.openingTime = new Date(); // establecer fecha de apertura igual a creación
  } else if (this.fechaOpcion === 'manual' && this.fechaManual) {
    const fechaSeleccionada = new Date(this.fechaManual);  // solo fecha
    const ahora = new Date();  // fecha y hora actual

    // Combinar la fecha seleccionada con la hora actual
    fechaSeleccionada.setHours(ahora.getHours(), ahora.getMinutes(), ahora.getSeconds());

    this.incident.createdAt = fechaSeleccionada;
    this.incident.openingTime = fechaSeleccionada; // establecer fecha de apertura igual a creación
  }

  console.log('Enviando incidente:', this.incident);
  
  this.incidentService.addIncident(this.incident).subscribe({
    next: (response) => {
      console.log('Incidente creado exitosamente:', response);
      const fechaEnvio = new Date().toLocaleString('es-ES');
      alert(`✅ Incidente enviado exitosamente el ${fechaEnvio}`);
      
      this.resetForm();
      this.isSubmitting = false;

      // Opcional: redirigir a la lista de incidentes
      // this.router.navigate(['/Lista-Incidente']);
    },
    error: (error) => {
      console.error('Error al enviar incidente:', error);
      alert('❌ Error al enviar el incidente. Verifique la conexión.');
      this.isSubmitting = false;
    }
  });
}

  resetForm(): void {
    this.incident = {
      id: 0,
      createdAt: new Date(),
      category: '',
      priority: '', 
      title: '',
      description: '',
      openingTime: null,
      closingTime: null,
      assignedTo: null,
      status: 'Abierto',
      resolution: null
    };
    this.fechaOpcion = '';
    this.fechaManual = '';
    this.fechaActual = '';
  }
}