const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'apps/vendor-dashboard/src/pages');

const replacements = [
  // Shadows
  { from: /hover:shadow-\[var\(--ease2event-shadow-xl\)\]/g, to: '' },
  { from: /hover:shadow-2xl/g, to: '' },
  { from: /hover:shadow-xl/g, to: '' },
  { from: /hover:shadow-lg/g, to: '' },
  { from: /hover:shadow-md/g, to: '' },
  { from: /hover:shadow-sm/g, to: '' },
  { from: /hover:shadow-none/g, to: '' },
  { from: /shadow-\[.*?\]/g, to: '' },
  { from: /shadow-2xl/g, to: '' },
  { from: /shadow-xl/g, to: '' },
  { from: /shadow-lg/g, to: '' },
  { from: /shadow-md/g, to: '' },
  { from: /shadow-sm/g, to: '' },
  { from: /shadow-inner/g, to: '' },
  
  // Specific group hovers that user might want gone
  { from: /group-hover:scale-105/g, to: '' },
  { from: /group-hover:scale-110/g, to: '' },
  { from: /hover:-translate-y-1/g, to: '' },
  { from: /hover:-translate-y-2/g, to: '' }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  // Clean up multiple spaces left by replacing with empty string
  content = content.replace(/  +/g, ' ');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

fs.readdirSync(dirPath).forEach(file => {
  if (file.endsWith('.tsx')) {
    processFile(path.join(dirPath, file));
  }
});
console.log('Done!');
