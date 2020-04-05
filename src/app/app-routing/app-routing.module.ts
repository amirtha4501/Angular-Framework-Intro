import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { allroutes } from './routes';

const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forRoot(allroutes)
  ],
  
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
