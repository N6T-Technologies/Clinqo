// packages/db/copy-engines.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find the schema file
const schemaPath = path.join(__dirname, 'prisma', 'schema.prisma');
if (!fs.existsSync(schemaPath)) {
  console.error(`Schema file not found at ${schemaPath}`);
  process.exit(1);
}

console.log(`Found schema at: ${schemaPath}`);

// Generate Prisma client with explicit schema path
console.log('Generating Prisma client...');
execSync(`npx prisma generate --schema="${schemaPath}"`, { stdio: 'inherit' });

// Path to Prisma engine files
const prismaClientDir = path.join(__dirname, 'node_modules', '.prisma', 'client');
if (!fs.existsSync(prismaClientDir)) {
  console.error(`Prisma client directory not found at ${prismaClientDir}`);
  process.exit(1);
}

// Find all engine files (both Windows and Linux)
const engineFiles = fs.readdirSync(prismaClientDir)
  .filter(file => file.startsWith('libquery_engine-') || file.startsWith('query-engine-'));

if (engineFiles.length === 0) {
  console.error('No Prisma engine files found!');
  process.exit(1);
}

console.log('Found engine files:', engineFiles);

// Copy engines to each location Prisma might look for them
const copyLocations = [
  path.join(__dirname, '..', '..', 'apps', 'hospital-client', '.next', 'server'),
  path.join(__dirname, '..', '..', 'apps', 'hospital-client', '.prisma', 'client'),
  path.join(__dirname, '..', '..', 'apps', 'hospital-client', 'node_modules', '.prisma', 'client'),
  path.join(__dirname, '..', '..', 'node_modules', '.prisma', 'client')
];

// Create directories if they don't exist
copyLocations.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

// Copy all engine files to all locations
engineFiles.forEach(engineFile => {
  const engineSource = path.join(prismaClientDir, engineFile);
  
  copyLocations.forEach(location => {
    const engineDest = path.join(location, engineFile);
    try {
      fs.copyFileSync(engineSource, engineDest);
      console.log(`Copied ${engineFile} to ${engineDest}`);
    } catch (error) {
      console.warn(`Failed to copy to ${engineDest}:`, error.message);
    }
  });
});

console.log('Engine copying complete');