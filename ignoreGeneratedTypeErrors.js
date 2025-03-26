const fs = require('fs');
const path = require('path');

// Function to recursively traverse directories and add @ts-ignore before specified variable declarations
function addTsIgnore(directoryPath) {
  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      // Recursive call for directories
      addTsIgnore(filePath);
    } else if (filePath.endsWith('.ts')) {
      // Add @ts-ignore before specified variable declarations in TypeScript files
      addTsIgnoreToFile(filePath);
    }
  });
}

// Function to add @ts-ignore before specified variable declarations in a TypeScript file
function addTsIgnoreToFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    // Define patterns for variable declarations
    const patterns = [
      /export\s+const\s+([a-zA-Z0-9_$]+)\s*:\s*z\.ZodSchema<[a-zA-Z0-9_$]+>\s*=\s*z\.lazy\(/g,
    ];

    // Iterate over patterns
    patterns.forEach((pattern) => {
      data = data.replace(pattern, '// @ts-ignore\n$&');
    });

    // Write the updated data back to the file
    fs.writeFile(filePath, data, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file ${filePath}:`, err);
      } else {
        console.log(`Added @ts-ignore to ${filePath}`);
      }
    });
  });
}

// Define the directories to traverse
const directories = ['prisma', 'zod'];

// Traverse through each directory and add @ts-ignore before specified variable declarations
directories.forEach((directory) => {
  const directoryPath = path.join(__dirname, directory);
  if (fs.existsSync(directoryPath)) {
    console.log(`Processing directory: ${directoryPath}`);
    addTsIgnore(directoryPath);
  } else {
    console.warn(`Directory not found: ${directoryPath}`);
  }
});
