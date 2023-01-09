import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { StrengthLevel } from '../strengthLevel';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.sass']
})
export class PasswordComponent implements OnInit, OnDestroy {
  private _sub!: Subscription;
  public passwordForm!: FormGroup;
  public strength: StrengthLevel = StrengthLevel.empty;

  constructor() { }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
    })

    this._sub = this.passwordForm.controls['password'].valueChanges.pipe(debounceTime(1000)).subscribe(
      (value) => {

      }
    )
  }

  ngOnDestroy(): void {
      this._sub.unsubscribe();
  }

  public chooseColor(strength: StrengthLevel, blockOrder: 1 | 2 | 3): string {
    if (strength === StrengthLevel.bad) return 'redBG';
    else if (strength === StrengthLevel.easy && blockOrder === 1) return 'redBG';
    else if (strength === StrengthLevel.medium && (blockOrder === 1 || blockOrder === 2)) return 'yellowBG';
    else if (strength === StrengthLevel.strong) return 'greenBG';
    else return 'grayBG';
  }
}
