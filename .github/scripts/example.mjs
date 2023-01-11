
export async function exampleExec({ exec, core }) {
  let myOutput = '';
  let myError = '';

  const options = {};
  options.listeners = {
    stdout: (data) => {
      myOutput += data.toString();
    },
    stderr: (data) => {
      myError += data.toString();
    }
  };
  options.cwd = './lib';

  await exec.exec('echo', ['node', 'index.js', 'foo=bar'], options);
}

export function printStuff() {
  console.log('stuff')
}

export default printStuff
