import fs from 'fs';
import util from 'util';

const promisifyReadFile = util.promisify(fs.readFile);

namespace training_async {
  const main = async () => {
    // Callback
    fs.readFile('../package.json', (err, data) => {
      console.log('###########################################');
      console.log('Callback');
      const fileContent = data.toString();
      console.log(fileContent);
      console.log('###########################################');
    });

    const readFilePromise = promisifyReadFile('../package.json');
    readFilePromise.then((data) => {
      console.log('###########################################');
      console.log('Promise');
      const fileContent = data.toString();
      console.log(fileContent);
      console.log('###########################################');
    });

    console.log('###########################################');
    console.log('async/await');
    const data = await fs.readFileSync('../package.json');
    const fileContent = data.toString();
    console.log(fileContent);
    console.log('###########################################');
  };

  main();
}
