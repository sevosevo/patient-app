import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeModule} from './feature';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BaseLayoutModule} from './layout';
import {UiModule} from './shared';
import {AddPatientModule, PatientListModule} from './feature';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // Ui modules
    UiModule,
    // Layout modules
    BaseLayoutModule,
    // Feature modules
    HomeModule,
    AddPatientModule,
    PatientListModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
