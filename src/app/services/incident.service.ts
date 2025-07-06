import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Incident } from '../models/incident.model';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {
  private apiUrl = 'http://localhost:8000/api/incidentes/';  // URL del backend Django

  constructor(private http: HttpClient) {}

  // Obtener todos los incidentes
  getIncidents(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.apiUrl);
  }

  // Obtener incidente por ID
  getIncidentById(id: number): Observable<Incident> {
    return this.http.get<Incident>(`${this.apiUrl}${id}/`);
  }

  // Agregar nuevo incidente
  addIncident(incident: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.apiUrl, incident);
  }

  // Actualizar incidente
  updateIncident(incident: Incident): Observable<Incident> {
    return this.http.put<Incident>(`${this.apiUrl}${incident.id}/`, incident);
  }

  // Eliminar incidente
  deleteIncident(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }

  // Filtrar incidentes por estado (desde Angular)
  getIncidentsByStatus(status: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}?status=${status}`);
  }

  // Filtrar incidentes por prioridad (desde Angular)
  getIncidentsByPriority(priority: string): Observable<Incident[]> {
    return this.http.get<Incident[]>(`${this.apiUrl}?priority=${priority}`);
  }
}
