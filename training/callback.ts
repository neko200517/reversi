namespace callback {
  const add = (v1: number, v2: number): number => {
    return v1 + v2;
  };

  const sub = (v1: number, v2: number): number => {
    return v1 - v2;
  };

  const calculate = (
    v1: number,
    v2: number,
    callback: (a: number, b: number) => number
  ) => {
    return callback(v1, v2);
  };

  const addResult = calculate(1, 2, add);
  console.log(addResult); // 3

  const subResult = calculate(1, 2, sub);
  console.log(subResult); // -1
}
