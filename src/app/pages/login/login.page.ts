import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentials: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.credentials = this.fb.group({
      mail: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    this.apiService.login(this.credentials.value).subscribe(
      async _ => {
        await loading.dismiss();
        this.router.navigateByUrl('/tabs/tab1', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Identifiant incorrect',
          message: res.error.msg,
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }
}
