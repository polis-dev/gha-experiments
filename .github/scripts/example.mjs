
export async function exampleExec() {
  const exec = require('@actions/exec');
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

export default function printStuff() {
  console.log('stuff')
}
