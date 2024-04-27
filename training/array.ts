namespace training_array {
  const numbers = [0, 10, 20];
  console.log(numbers);

  // forEach
  numbers.forEach((num, i) => {
    const double = num * 2;
    console.log(`${i}: ${double}`);
  });

  // map
  const names = ['hoge', 'hoge2', 'hoge3', 'hoge4'];
  const users = names.map((name, i) => {
    return { id: i, name: name };
  });
  console.log(users);

  // filter
  const evenIdUsers = users.filter((user) => user.id % 2 === 0);
  console.log(evenIdUsers);

  // reduce
  // 第二引数0を初期値として前回の値+現在のインデックスの値を加算する
  const sum = numbers.reduce((previous, current) => previous + current, 0);
  console.log(sum);
}
