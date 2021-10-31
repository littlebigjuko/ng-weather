import { Component, Input } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

enum SubmitButtonState {
  SUBMIT,
  LOADING,
  DONE,
  ERROR,
}
const RESET_MS = 1000;
const UX_VISIBILITY_MS = 500;

@Component({
  selector: 'app-submit-button',
  styleUrls: ['./submit-button.component.scss'],
  templateUrl: './submit-button.component.html',
})
export class SubmitButtonComponent {
  @Input() submitable: Observable<any>;
  @Input() reset = RESET_MS;

  states = SubmitButtonState;
  state: SubmitButtonState = SubmitButtonState.SUBMIT;

  execute() {
    if (this.state !== SubmitButtonState.SUBMIT) return;
    this.state = SubmitButtonState.LOADING;
    this.submitable
      .pipe(
        delay(UX_VISIBILITY_MS),
        map(() => (this.state = SubmitButtonState.DONE)),
        catchError(() => {
          this.state = SubmitButtonState.ERROR;
          return of(true);
        }),
        delay(this.reset)
      )
      .subscribe(() => {
        this.state = SubmitButtonState.SUBMIT;
      });
  }
}
