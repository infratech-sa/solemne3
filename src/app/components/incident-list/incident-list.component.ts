import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Incident } from '../../models/incident.model';
import { IncidentService } from '../../services/incident.service';

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {
  sortOrder: string = 'priority'; // Valor por defecto

  technicians = ['Eduardo Rojas', 'Camila Campos', 'Carlos Sánchez'];

  filterCategory: string = '';
  filterStatus: string = '';
  filterPriority: string = '';
  filterDate: string = '';

  incidents: Incident[] = [];
  filteredIncidents: Incident[] = [];

  constructor(
    private incidentService: IncidentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadIncidents();
  }

  loadIncidents(): void {
    this.incidentService.getIncidents().subscribe((data: Incident[]) => {
      this.incidents = data.map(inc => ({
        ...inc,
        createdAt: new Date(inc.createdAt),
        closingTime: inc.closingTime ? new Date(inc.closingTime) : null
      }));
      this.applyFilters();
    });
  }

  sortIncidents() {
    if (this.sortOrder === 'priority') {
      this.filteredIncidents.sort((a, b) => {
        const aUnresolved48h = this.isUnresolvedFor48Hours(a);
        const bUnresolved48h = this.isUnresolvedFor48Hours(b);

        if (aUnresolved48h && !bUnresolved48h) {
          return -1;
        }
        if (!aUnresolved48h && bUnresolved48h) {
          return 1;
        }
        return b.createdAt.getTime() - a.createdAt.getTime();
      });
    } else if (this.sortOrder === 'newest') {
      this.filteredIncidents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else if (this.sortOrder === 'oldest') {
      this.filteredIncidents.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    } else if (this.sortOrder === 'id') {
      this.filteredIncidents.sort((a, b) => a.id - b.id);
    }
  }

  applyFilters() {
    this.filteredIncidents = this.incidents.filter(inc => {
      const matchCategory = this.filterCategory ? inc.category === this.filterCategory : true;
      const matchStatus = this.filterStatus ? inc.status === this.filterStatus : true;
      const matchPriority = this.filterPriority ? inc.priority === this.filterPriority : true;
      const matchDate = this.filterDate ? new Date(inc.createdAt) >= new Date(this.filterDate) : true;
      return matchCategory && matchStatus && matchPriority && matchDate;
    });
    this.sortIncidents();
  }

  refreshIncidents(): void {
    this.loadIncidents();
  }

  formatDateSpanish(date: Date | null): string {
    if (!date) return 'No especificado';
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  isUnresolvedFor48Hours(incident: Incident): boolean {
    if (incident.status === 'Cerrado') return false;

    const now = new Date();
    const createdAt = new Date(incident.createdAt);
    const hoursDiff = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);

    return hoursDiff > 48;
  }

  // Método para navegar a los detalles del incidente
  goToDetails(incidentId: number): void {
    // Establecer orden por ID antes de navegar
    this.sortOrder = 'id';
    this.applyFilters();
    this.router.navigate(['/Asignar-Tecnico', incidentId]);
  }
}
