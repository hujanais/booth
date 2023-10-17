import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();

  loginForm: FormGroup;
  hidePassword = true;
  message: string = '';
  isConnected = false;

  constructor(private fb: FormBuilder, private api: BoothApiService) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  ngOnInit(): void {
    this.subscriptions.add(
      this.api.wss.isConnected.subscribe((state: boolean) => {
        this.isConnected = state
      })
    );
  }

  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }

  public login(): void {
    const username = this.usernameControl.value;
    const password = this.passwordControl.value;
    this.api.login(username, password).subscribe({
      next: (jwtToken: string) => {
        this.message = `Welcome ${username}`;
      },
      error: (err: HttpErrorResponse | Error) => {
        if (err instanceof HttpErrorResponse) {
          this.message = `${err.status}. ${err.error}`;
        } else {
          this.message = `${err.message}`;
        }
      }
    })
  }

  private get usernameControl(): AbstractControl<string> {
    return this.loginForm.get('username')!;
  }

  private get passwordControl(): AbstractControl<string> {
    return this.loginForm.get('password')!;
  }

}
