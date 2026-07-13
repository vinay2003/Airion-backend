const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, 'apps/vendor-dashboard/src/pages');

const replacements = [
  // Padding & Margin
  { from: /!p-10/g, to: 'p-6' },
  { from: /!p-8/g, to: 'p-5' },
  { from: /!p-6/g, to: 'p-4' },
  { from: /p-10/g, to: 'p-6' },
  { from: /p-8/g, to: 'p-5' },
  { from: /pb-24/g, to: 'pb-12' },
  { from: /pb-20/g, to: 'pb-10' },
  { from: /pb-12/g, to: 'pb-6' },
  { from: /pb-10/g, to: 'pb-6' },
  { from: /space-y-12/g, to: 'space-y-8' },
  { from: /space-y-10/g, to: 'space-y-6' },
  { from: /space-y-8/g, to: 'space-y-5' },
  { from: /gap-12/g, to: 'gap-6' },
  { from: /gap-10/g, to: 'gap-6' },
  { from: /gap-8/g, to: 'gap-5' },
  { from: /px-10/g, to: 'px-6' },
  { from: /px-8/g, to: 'px-5' },

  // Border Radius
  { from: /rounded-\[3rem\]/g, to: 'rounded-xl' },
  { from: /rounded-\[2\.5rem\]/g, to: 'rounded-xl' },
  { from: /rounded-\[2rem\]/g, to: 'rounded-xl' },
  { from: /rounded-\[1\.5rem\]/g, to: 'rounded-lg' },
  { from: /rounded-t-\[2\.5rem\]/g, to: 'rounded-t-xl' },
  { from: /rounded-t-\[3rem\]/g, to: 'rounded-t-xl' },
  
  // Heights
  { from: /h-16/g, to: 'h-12' },
  { from: /!h-14/g, to: 'h-10' },
  { from: /h-14/g, to: 'h-10' },
  { from: /h-\[480px\]/g, to: 'h-[320px]' },
  { from: /h-\[500px\]/g, to: 'h-[350px]' },
  { from: /h-\[600px\]/g, to: 'h-[400px]' },

  // Hover Scale Effects
  { from: /hover:scale-\[1\.02\]/g, to: '' },
  { from: /group-hover:scale-110/g, to: '' },
  { from: /group-hover:scale-105/g, to: '' },
  { from: /hover:shadow-\[var\(--ease2event-shadow-xl\)\]/g, to: 'hover:shadow-lg' },

  // Fonts
  { from: /text-5xl/g, to: 'text-3xl' },
  { from: /text-4xl/g, to: 'text-2xl' },
  { from: /text-3xl/g, to: 'text-xl' },
  { from: /text-2xl/g, to: 'text-lg' },

  // Icon sizes - these are hard to safely regex without parsing, but we can do simple ones:
  { from: /size=\{40\}/g, to: 'size={24}' },
  { from: /size=\{32\}/g, to: 'size={24}' },
  { from: /size=\{28\}/g, to: 'size={20}' },
  { from: /size=\{24\}/g, to: 'size={20}' },
  { from: /size=\{20\}/g, to: 'size={16}' },
  
  // Widths (wrapper size changes)
  { from: /px-0 w-full/g, to: 'px-6 w-full max-w-7xl mx-auto' },
  { from: /px-4 w-full/g, to: 'px-6 w-full max-w-7xl mx-auto' },
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  replacements.forEach(({ from, to }) => {
    content = content.replace(from, to);
  });

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${path.basename(filePath)}`);
  }
}

fs.readdirSync(dirPath).forEach(file => {
  if (file.endsWith('.tsx') && !['Dashboard.tsx', 'Listings.tsx'].includes(file)) {
    processFile(path.join(dirPath, file));
  }
});
console.log('Done!');
