import { NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { AuthGuard } from './auth.guard';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations : [AuthComponent],
  imports:[CommonModule, 
    FormsModule, 
    RouterModule.forChild([{ path: '', component: AuthComponent }]), // path: 'auth' -> changed for lazy loading
    SharedModule
   ]
})
export class AuthModule{}