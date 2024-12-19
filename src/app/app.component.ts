import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  public readonly exteriorButtonImages = [
    'stealth-grey',
    'pearl-white',
    'deep-blue-metallic',
    'solid-black',
    'ultra-red',
    'quicksilver',
  ];

  public readonly interiorButtonImages = ['dark', 'light'];

  public readonly wheelButtons = [
    {
      name: 'Standard Wheels',
      price: 0,
    },
    {
      name: 'Performance Wheels (+$2,500)',
      price: 2500,
    },
  ];

  public fullSelfDrivingCost = signal<boolean>(false);
  public centerConsoleTrays = signal<boolean>(false);
  public sunshade = signal<boolean>(false);
  public allWeatherInteriorLiners = signal<boolean>(false);

  private initialCost = signal<number>(52490);
  private fsdc = computed(() => (this.fullSelfDrivingCost() ? 8500 : 0));
  private cct = computed(() => (this.centerConsoleTrays() ? 35 : 0));
  private ss = computed(() => (this.sunshade() ? 105 : 0));
  private awil = computed(() => (this.allWeatherInteriorLiners() ? 225 : 0));

  private performanceUpgradeCost = computed(() =>
    this.performanceUpgradeSelected() ? 5000 : 0
  );

  public exteriorImage = signal<string>(this.exteriorButtonImages[0]);
  public interiorImage = signal<string>(this.interiorButtonImages[0]);
  public wheelButtonSelected = signal<{ name: string; price: number }>(
    this.wheelButtons[0]
  );
  public performanceUpgradeSelected = signal<boolean>(false);

  public totalPrice = computed(() => {
    return (
      this.initialCost() +
      this.performanceUpgradeCost() +
      this.fsdc() +
      this.wheelButtonSelected().price +
      this.cct() +
      this.ss() +
      this.awil()
    );
  });

  public downPayment = computed(() => this.totalPrice() * 0.1);

  private loanAmount = computed(() => this.totalPrice() - this.downPayment());

  public monthlyPayment = computed(() => {
    const loanTermMonths = 60;
    const interestRate = 0.03;
    const monthlyInterestRate = interestRate / 12;

    return (
      (this.loanAmount() *
        (monthlyInterestRate *
          Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
      (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1)
    );
  });

  public performance = signal<string>('');

  public selectExteriorColor(button: string): void {
    this.exteriorImage.set(button);
  }

  public selectInteriorColor(button: string): void {
    this.interiorImage.set(button);
  }

  public onSelectWheelButton(button: { name: string; price: number }): void {
    this.wheelButtonSelected.set(button);
    this.performance.set(button.price ? '-performance' : '');
  }

  public selectPerformanceUpgrade(): void {
    this.performanceUpgradeSelected.update((v) => !v);
  }
}
