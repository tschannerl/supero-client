import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material-modules';
import { TaskListComponent,  DialogTask, DialogConfirm } from './task-list/task-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    DialogTask,
    DialogConfirm
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],

  entryComponents: [
    DialogTask,
    DialogConfirm
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
