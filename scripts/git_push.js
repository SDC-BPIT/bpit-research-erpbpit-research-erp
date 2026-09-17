const dugite = require('dugite');
const path = require('path');

const repoPath = path.resolve(__dirname, '..');
const repoUrl = 'https://github.com/SDC-BPIT/bpit-research-erp.git';

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
  console.log('🚀 Starting Git Workflow via Dugite...');
  console.log('Embedded Git Binary:', dugite.resolveGitBinary());
  
  await runGitCommand(['init'], 'Initialize Git repository');
  try { await runGitCommand(['remote', 'remove', 'origin'], 'Remove existing origin'); } catch(e){}
  await runGitCommand(['remote', 'add', 'origin', repoUrl], 'Add remote origin URL');
  await runGitCommand(['config', 'user.name', 'BPIT ERP Admin'], 'Set Git user name');
  await runGitCommand(['config', 'user.email', 'admin@bpitindia.com'], 'Set Git user email');
  await runGitCommand(['add', '.'], 'Stage all project files');
  await runGitCommand(['commit', '-m', 'Refactor: Modularize project architecture into frontend, backend, prisma, database, scripts, docs'], 'Commit staged changes');
  await runGitCommand(['branch', '-M', 'main'], 'Rename branch to main');
  await runGitCommand(['push', '-u', 'origin', 'main', '--force'], 'Push to GitHub remote main branch');
}

main().catch(console.error);
