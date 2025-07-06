import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { IncidentService } from '../../services/incident.service';
import { Incident } from '../../models/incident.model';

@Component({
  selector: 'app-incident-statistics',
  templateUrl: './incident-statistics.component.html',
  styleUrls: ['./incident-statistics.component.css']
})
export class IncidentStatisticsComponent implements OnInit {
  
  totalIncidents: number = 0;
  resolvedIncidents: number = 0;
  openIncidents: number = 0;
  inProgressIncidents: number = 0;

  constructor(private incidentService: IncidentService) {}

  ngOnInit(): void {
    this.calculateDashboardStats();
  }

  calculateDashboardStats(): void {
    this.incidentService.getIncidents().subscribe((incidents: Incident[]) => {
      this.totalIncidents = incidents.length;
      this.resolvedIncidents = incidents.filter(i => i.status === 'Cerrado').length;
      this.openIncidents = incidents.filter(i => i.status === 'Abierto').length;
      this.inProgressIncidents = incidents.filter(i => i.status === 'En progreso').length;

      this.renderCategoryChart(incidents);
      this.renderMonthlyChart(incidents);
      this.renderResolutionStatusChart(incidents);
    });
  }

  renderCategoryChart(incidents: Incident[]) {
    const categoryCanvas = document.getElementById('categoryChart') as HTMLCanvasElement;
    if (!categoryCanvas) return;

    const categoryStats = this.getCategoryStatistics(incidents);

    new Chart(categoryCanvas, {
      type: 'doughnut',
      data: {
        labels: Object.keys(categoryStats),
        datasets: [
          {
            data: Object.values(categoryStats),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Distribución por Categoría',
            font: { size: 16, weight: 'bold' }
          },
          legend: {
            position: 'bottom',
            labels: { padding: 15, usePointStyle: true }
          }
        }
      }
    });
  }

  renderMonthlyChart(incidents: Incident[]) {
    const monthlyCanvas = document.getElementById('monthlyChart') as HTMLCanvasElement;
    if (!monthlyCanvas) return;

    const monthlyStats = this.getMonthlyStatistics(incidents);
    
    // Definir el orden cronológico de los meses
    const monthOrder = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Filtrar y ordenar solo los meses que tienen incidentes
    const orderedLabels = monthOrder.filter(month => monthlyStats[month] > 0);
    const orderedData = orderedLabels.map(month => monthlyStats[month]);

    new Chart(monthlyCanvas, {
      type: 'bar',
      data: {
        labels: orderedLabels,
        datasets: [
          {
            label: 'Cantidad de Incidentes',
            data: orderedData,
            backgroundColor: '#36A2EB',
            borderColor: '#2E8BC0',
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Incidentes por Mes',
            font: { size: 16, weight: 'bold' }
          },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#e9ecef' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  renderResolutionStatusChart(incidents: Incident[]) {
    const statusCanvas = document.getElementById('resolutionChart') as HTMLCanvasElement;
    if (!statusCanvas) return;

    const resolutionStats = this.getResolutionStatistics(incidents);

    new Chart(statusCanvas, {
      type: 'bar',
      data: {
        labels: ['Resueltos', 'No Resueltos'],
        datasets: [
          {
            label: 'Número de Incidentes',
            data: [resolutionStats.resolved, resolutionStats.unresolved],
            backgroundColor: ['#28a745', '#dc3545'],
            borderColor: ['#1e7e34', '#bd2130'],
            borderWidth: 2,
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: 'Estado de Resolución',
            font: { size: 16, weight: 'bold' }
          },
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 },
            grid: { color: '#e9ecef' }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  private getCategoryStatistics(incidents: Incident[]): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    incidents.forEach(incident => {
      stats[incident.category] = (stats[incident.category] || 0) + 1;
    });
    return stats;
  }

  private getMonthlyStatistics(incidents: Incident[]): { [key: string]: number } {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Solo contar incidentes por mes (sin inicializar con 0)
    const stats: { [key: string]: number } = {};

    incidents.forEach(incident => {
      const createdAt = new Date(incident.createdAt);
      const month = monthNames[createdAt.getMonth()];
      stats[month] = (stats[month] || 0) + 1;
    });

    return stats;
  }

  private getResolutionStatistics(incidents: Incident[]): { resolved: number, unresolved: number } {
    let resolved = 0;
    let unresolved = 0;

    incidents.forEach(incident => {
      if (incident.status === 'Cerrado') {
        resolved++;
      } else {
        unresolved++;
      }
    });

    return { resolved, unresolved };
  }
}
