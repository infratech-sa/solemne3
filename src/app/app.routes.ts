import { Routes } from '@angular/router';


import { DashboardComponent } from './components/dashboard/dashboard.component';
import { IncidentFormComponent } from './components/incident-form/incident-form.component';
import { IncidentListComponent } from './components/incident-list/incident-list.component';
import { IncidentDetailComponent } from './components/incident-detail/incident-detail.component';
import { IncidentStatisticsComponent } from './components/incident-statistics/incident-statistics.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';



export const routes: Routes = [
  { path: '', component: DashboardComponent }, // ruta por defecto
  { path: 'Reportar-Incidente', component: IncidentFormComponent },
  { path: 'Lista-Incidente', component: IncidentListComponent },
  { path: 'Asignar-Tecnico', component: IncidentDetailComponent },
  { path: 'Asignar-Tecnico/:id', component: IncidentDetailComponent },
  { path: 'Estadisticas', component: IncidentStatisticsComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'Register', component: RegisterComponent },
];