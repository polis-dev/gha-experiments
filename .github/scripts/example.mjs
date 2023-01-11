
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

export async function exampleGraphQL({ github, context }) {
  const query = `query($owner:String!, $name:String!, $label:String!) {
              repository(owner:$owner, name:$name){
                issues(first:100, labels: [$label]) {
                  nodes {
                    id
                  }
                }
              }
            }`;
  const variables = {
    owner: context.repo.owner,
    name: context.repo.repo,
    label: 'wontfix'
  }
  const result = await github.graphql(query, variables)
  console.log("::group::GraphQL Query\n", result, "\n::endgroup::")
}

export function printStuff() {
  console.log('stuff')
}

export default printStuff
