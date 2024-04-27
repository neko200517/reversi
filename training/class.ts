class Fraction {
  constructor(private _numerator: number, private _denominator: number) {}

  // メソッド
  toString(): string {
    return `${this._numerator} / ${this._denominator}`;
  }

  add(other: Fraction): Fraction {
    const resultNumerator =
      this._numerator * other.denominator + this._denominator * other.numerator;
    const resultDenominator = this._denominator * other.denominator;

    return new Fraction(resultNumerator, resultDenominator);
  }

  get numerator() {
    return this._numerator;
  }

  get denominator() {
    return this._denominator;
  }
}

const f1 = new Fraction(1, 2); // 1/2
console.log(f1.toString());

const f2 = new Fraction(1, 3); // 1/3
console.log(f2.toString());

const result = f1.add(f2);
console.log(result.toString()); // 5/6
