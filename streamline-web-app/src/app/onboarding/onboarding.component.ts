import { Component } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrl: './onboarding.component.scss',
})
export class OnboardingComponent {
  active: number = 0;

  name: string | undefined = undefined;

  email: string | undefined = undefined;

  password: string | undefined = undefined;

  option1: boolean | undefined = false;

  option2: boolean | undefined = false;

  option3: boolean | undefined = false;

  option4: boolean | undefined = false;

  option5: boolean | undefined = false;

  option6: boolean | undefined = false;

  option7: boolean | undefined = false;

  option8: boolean | undefined = false;

  option9: boolean | undefined = false;

  option10: boolean | undefined = false;
}
