/*

Example usage in workflow yaml file:
---yaml
jobs:
  example-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/github-script@v6
        with:
          script: |-
            // this is the default context, provided by the github-script action.
            const ctx = { exec, core, context, io, glob, github, require, process }
            // this is the example script, which is a local file.
            const lib = await import('${{ github.workspace }}/.github/script.mjs')
            // we can now call the functions in the example script (await works too!).
            console.print(await lib.rickAndMortyEpisode(ctx, 28))
---
 */


/**
 * Example function that uses the exec module.
 *
 * @param {*} ctx context object, provided by the github-script action at
 *            runtime.
 */
export async function exampleExec({ exec }) {
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
  options.cwd = './';

  await exec.exec('echo', ['node', 'index.js', 'foo=bar'], options);
}

/**
 * Example function that uses a graphql query
 *
 * @param {*} ctx context object, provided by the github-script action at
 *            runtime.
 */
export async function exampleGraphQL({ core, github, context }) {
  const query = `query($owner:String!, $name:String!, $label:String!) {
              repository(owner:$owner, name:$name){
                issues(first:100, labels: [$label]) {
                  nodes {
                    id
                  }
                }
              }
            }`;

  core.startGroup('GraphQL Query')
  const result = await github.graphql(query, {
    owner: context.repo.owner,
    name: context.repo.repo,
    label: 'wontfix'
  })
  console.log(result)
  core.endGroup()
}

/**
 * Example function that makes an external request to a arbitrary API.
 *
 
 * @param {*} ctx context object, provided by the github-script action at
 *            runtime.
 */
export async function externalAPI({ core, github, context }) {
  const result = await github.request('GET https://debug.polis.dev/')
  console.log(result)
  core.endGroup()
}

/**
 * Example function that returns a user's ssh keys via the API.
 *
 * @param {*} ctx context object, provided by the github-script action at
 *            runtime.
 */
export async function listSSHKeysForUsername({ core, github, context }, username) {
  core.startGroup('ssh keys for ' + username)
  const result = await github.request('GET /users/{username}/keys', { username })
  console.log(result)
  core.endGroup()
}

/** Example function designed to demonstrate the functionality of this script when no inputs are provided.
 *
 * @param {*} ctx context object, provided by the github-script action at runtime.
 */
export function doDemo({ core, github, context }) {
  core.startGroup("Demonstrate core functionality...")
  core.notice("This is a demo of the github-script action's functionality.")
  core.warning("It is _very_ cool.", { file: ".github/script.mjs", startLine: 2 })
  console.log('stuff')
  core.saveState("demonstration", "complete")
  core.getInput("script", { required: false })
  core.exportVariable("DEMONSTRATION", "TRUE")
  core.setSecret("shhhDontTellAnyone")
  core.setOutput("demonstration", "complete")
  core.addPath("/usr/local/bin")
  core.endGroup()
}

export default doDemo
