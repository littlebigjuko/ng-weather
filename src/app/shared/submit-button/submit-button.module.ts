import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SubmitButtonComponent } from './submit-button.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SubmitButtonComponent],
  exports: [SubmitButtonComponent],
})
export class SubmitButtonModule {}
