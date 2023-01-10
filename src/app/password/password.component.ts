import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, Subscription } from 'rxjs';
import { StrengthLevels } from '../shared/strengthLevel';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.sass']
})
export class PasswordComponent implements OnInit, OnDestroy {
  public passwordForm!: FormGroup;
  public strength: StrengthLevels = StrengthLevels.empty;
  private _sub!: Subscription;

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
    })

    this._sub = this.passwordForm.controls['password'].valueChanges.pipe(debounceTime(200)).subscribe(
      (value: string) => {
        const password = value.trim();

        if (!password) this.strength = StrengthLevels.empty;
        else if (password.length < 8) this.strength = StrengthLevels.bad;
        else this.strength = this._defineStrengthBasedOnConditions(password);
      }
    )
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();
  }

  public chooseColor(strength: StrengthLevels, blockOrder: 1 | 2 | 3): string {
    if (strength === StrengthLevels.bad) return 'redBG';
    else if (strength === StrengthLevels.easy && blockOrder === 1) return 'redBG';
    else if (strength === StrengthLevels.medium && (blockOrder === 1 || blockOrder === 2)) return 'yellowBG';
    else if (strength === StrengthLevels.strong) return 'greenBG';
    else return 'grayBG';
  }

  private _defineStrengthBasedOnConditions(str: string): StrengthLevels {
    let fulfilledConditions = 0;

    if (str.match(/\d/)) fulfilledConditions++;
    if (str.match(/[a-z]/i)) fulfilledConditions++;
    if (str.match(/\p{P}/u) || str.match(/\p{M}/u) || str.match(/\p{S}/u)) fulfilledConditions++;

    switch (fulfilledConditions) {
      case 1:
        return StrengthLevels.easy
        break

      case 2:
        return StrengthLevels.medium
        break

      case 3:
        return StrengthLevels.strong
        break

      default:
        return StrengthLevels.empty
    }
  }
}



