import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AddPatientComponent, PatientListComponent, HomeComponent} from './feature';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'patients',
    children: [
      { path: '', component: PatientListComponent },
      { path: 'add-patient', component: AddPatientComponent },
    ],
  },
  {
    pathMatch: 'full',
    path: '',
    redirectTo: 'home'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
