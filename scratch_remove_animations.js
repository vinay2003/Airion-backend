const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'apps/vendor-dashboard/src/pages');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // 1. Remove Tailwind animation classes
  const classesToRemove = [
    'animate-in',
    'fade-in',
    'zoom-in',
    /slide-in-from-[a-z0-9-]+/g,
    /duration-\d+/g,
    /delay-\d+/g,
  ];

  classesToRemove.forEach(cls => {
    if (typeof cls === 'string') {
      content = content.split(cls).join('');
    } else {
      content = content.replace(cls, '');
    }
  });

  // 2. Replace motion.div with div
  content = content.replace(/<motion\.div/g, '<div');
  content = content.replace(/<\/motion\.div>/g, '</div>');
  content = content.replace(/<motion\.span/g, '<span');
  content = content.replace(/<\/motion\.span>/g, '</span>');
  content = content.replace(/<motion\.button/g, '<button');
  content = content.replace(/<\/motion\.button>/g, '</button>');
  
  // 3. Remove framer-motion props
  // Handles double braces: initial={{ opacity: 0 }}
  content = content.replace(/\b(initial|animate|exit|transition|variants)=\{\s*\{[^}]*\}\s*\}/g, '');
  // Handles single braces: variants={itemVariants}
  content = content.replace(/\b(initial|animate|exit|transition|variants)=\{[^}]*\}/g, '');
  
  // Clean up any stray variants="" if people used strings
  content = content.replace(/\b(initial|animate|exit|transition|variants)="[^"]*"/g, '');

  // 4. Remove framer-motion imports if unused (optional but good)
  // Let's just leave imports to avoid regex breaking other things, 
  // TS might complain about unused imports but it won't break the build.
  // We'll clean up multiple spaces.
  content = content.replace(/  +/g, ' ');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

// Process all files in pages
function traverseDir(dir) {
    fs.readdirSync(dir).forEach(file => {
      const fullPath = path.join(dir, file);
      if (fs.statSync(fullPath).isDirectory()) {
          traverseDir(fullPath);
      } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
          processFile(fullPath);
      }
    });
}

traverseDir(dirPath);

// Also check components
const compPath = path.join(__dirname, 'apps/vendor-dashboard/src/components');
if (fs.existsSync(compPath)) {
    traverseDir(compPath);
}

console.log('Done!');
