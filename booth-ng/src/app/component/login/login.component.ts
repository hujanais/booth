import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { BoothApiService } from 'src/app/services/booth-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  message: string = '';

  constructor(private fb: FormBuilder, private api: BoothApiService) {
    this.loginForm = this.fb.group({
      username: [''],
      password: ['']
    });
  }

  public login(): void { 
    const username = this.usernameControl.value;
    const password = this.passwordControl.value;
    this.api.login(username, password).subscribe({
      next: (jwtToken: string) => {
        this.message = `Welcome ${username}`;
      },
      error: (err: HttpErrorResponse) => {
        this.message = `${err.status}. ${err.statusText}`;
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
