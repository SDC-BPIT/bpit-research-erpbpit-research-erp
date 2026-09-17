const dugite = require('dugite');
const path = require('path');

const repoPath = path.resolve(__dirname, '..');
const repoUrl = 'https://github.com/SDC-BPIT/bpit-research-erpbpit-research-erp.git';

async function runGitCommand(args, desc) {
  console.log(`\n> Running: git ${args.join(' ')} (${desc})`);
  const result = await dugite.exec(args, repoPath);
  if (result.stdout) console.log(result.stdout.trim());
  if (result.stderr) console.log(result.stderr.trim());
  if (result.exitCode !== 0) {
    console.error(`❌ Failed: git ${args.join(' ')} (exit code ${result.exitCode})`);
  } else {
    console.log(`✅ Success: ${desc}`);
  }
  return result;
}

async function main() {
  console.log('🚀 Setting Remote URL to exact repo:', repoUrl);
  await runGitCommand(['remote', 'set-url', 'origin', repoUrl], 'Update origin URL');
  console.log('Pushing main branch to GitHub...');
  await runGitCommand(['push', '-u', 'origin', 'main', '--force'], 'Push to GitHub');
}

main().catch(console.error);
