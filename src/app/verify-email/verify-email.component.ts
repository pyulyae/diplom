import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {i18nMetaToJSDoc} from "@angular/compiler/src/render3/view/i18n/meta";

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  userId!: number;
  tokenForm!: FormGroup;
  token!: string;
  ostatokVremeni!: number;

  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {
  }

  ngOnInit(): void {
    this.tokenForm = this.fb.group({
      "token": [this.token]
    });
    this.route.params.subscribe(params => {
      this.userId = +params['userId'];
    });
    const kolichestvoSecund = 30;  // желаемое время таймера в минутах (5 минут)
    const tekuscheyeVremya = new Date(); // получаем сегодняшнюю дату и время
    const deadlineTime = tekuscheyeVremya.setSeconds(tekuscheyeVremya.getSeconds() + kolichestvoSecund); // устанавливаем таймер
    // обновляем скрипт каждую секунду - так мы получаем обратный отсчет
    let obratniyOtschet = setInterval(function (t) {
      let seychas = new Date().getTime(); // текущее время
      let ostatokVremeni = deadlineTime - seychas; // находим различие между текущим моментом и временем дедлайна
      // преобразовываем значение миллисекунд в минуты и секунды
      let secundi: string | number = Math.floor((ostatokVremeni % (1000 * 60)) / 1000);
      // если значение текущей минуты или секунды меньше 10, добавляем вначале ведущий ноль
      secundi = secundi < 10 ? "0" + secundi : secundi;
      // отображаем результат таймера в элементе с id="deadline-timer"
      if (document.getElementById("deadline-timer")) {
        document.getElementById("deadline-timer")!.innerHTML = secundi.toString();
      }

      // когда обратный отсчет закончился, отображаем соответствующее уведомление
      if (ostatokVremeni < 0) {
        clearInterval(obratniyOtschet);
        if (document.getElementById("time-remainer")) {
          document.getElementById("time-remainer")!.innerHTML = "<span class = 'email' style='cursor: pointer'>Resend the code</span>";
        }
      }
    }, 1000);
  }
  sendTokenWhenPossible() {
    if (document.getElementById("time-remainer")!.textContent === 'Resend the code') {
      this.sendToken();
      window.location.reload();
    }
  }

  sendToken() {
    this.authService.sendToken(this.userId).subscribe();
  }

  verifyEmail(value: any) {
    this.authService.confirmAccount(this.userId, value.token)
      .subscribe(() => {
        this.router.navigate(['/']);
      })
  }

}
