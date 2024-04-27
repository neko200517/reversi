const STONE = 0;
const PAPER = 1;
const SCISSORS = 2;

interface HandGenerator {
  generate(): number;
}

// 3通りの手を返すジェネレータクラス
class RandomHandGenarator implements HandGenerator {
  generate(): number {
    return Math.floor(Math.random() * 3); // 0～2の数値を生成
  }

  generateArray(): number[] {
    return [];
  }
}

// グーの手のみ返すジェネレータクラス
class StoneHandGenerator implements HandGenerator {
  generate(): number {
    return STONE;
  }
}

class Janken {
  play(handGenerator: HandGenerator) {
    const computerHand = handGenerator.generate();
    console.log(computerHand);

    // 勝敗判定
  }
}

const janken = new Janken();
const randomGenerator = new RandomHandGenarator();
janken.play(randomGenerator);

const stoneGenerator = new StoneHandGenerator();
janken.play(stoneGenerator);
