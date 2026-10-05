const { execSync } = require('child_process');

console.log('Starting full database setup and seeding process...');

const scripts = [
  { name: 'Create Database', file: 'setup-db.js' },
  { name: 'Sync Tables', file: 'sync-db.js' },
  { name: 'Main Data Seed (Users, Base Products, Artists)', file: 'seed.js' },
  { name: 'Additional Artists', file: 'add_artists.js' },
  { name: 'New Products Batch 1', file: 'seed-new-products.js' },
  { name: 'New Products Batch 2', file: 'seed-more-products.js' },
  { name: 'Perfumes Seed', file: 'seed-perfumes.js' }
];

for (const script of scripts) {
  console.log(`\n========================================`);
  console.log(`Executing: ${script.name} (${script.file})`);
  console.log(`========================================`);
  try {
    const output = execSync(`node ${script.file}`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Error executing ${script.file}. Setup halted.`);
    process.exit(1);
  }
}

console.log('\n✅ All database setup and seeding scripts completed successfully!');
console.log('Your database is now fully populated and ready to use on this laptop.');
