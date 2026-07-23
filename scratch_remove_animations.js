const fs = require('fs');
const path = require('path');

const targetDir = path.join(process.cwd(), 'apps', 'admin-panel', 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        const dirPath = path.join(dir, f);
        if (fs.statSync(dirPath).isDirectory()) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    });
}

// hover classes: hover:bg-red-500, dark:hover:text-white, md:hover:scale-105, focus:hover:..., etc.
// Note: we can just match any modifier chain ending with hover:
const hoverRegex = /(?<=\s|['"`])([a-z0-9-:]+:)?hover:[a-zA-Z0-9_\[\]\/-]+(?=\s|['"`])/g;

// shadow classes: shadow, shadow-sm, shadow-none, drop-shadow, drop-shadow-xl, etc.
const shadowRegex = /(?<=\s|['"`])(shadow(-[a-zA-Z0-9_\[\]\/-]+)?|drop-shadow(-[a-zA-Z0-9_\[\]\/-]+)?)(?=\s|['"`])/g;

// Also might want to remove "transition-*" since without hover, transitions are mostly useless (though they might apply to focus/active too, but usually hover). The user specifically asked for shadow and hover. I will just do shadow and hover.

let totalFiles = 0;
let modifiedFiles = 0;

walkDir(targetDir, (filePath) => {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        totalFiles++;
        let content = fs.readFileSync(filePath, 'utf-8');
        let originalContent = content;

        // Apply multiple passes in case of consecutive matches sharing a space (lookarounds don't consume characters, but it's safer)
        content = content.replace(hoverRegex, '');
        content = content.replace(shadowRegex, '');
        
        // Since lookarounds don't consume spaces, replacing them with empty string will leave double spaces, e.g. "a  b".
        // This is perfectly fine in HTML classes.

        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf-8');
            modifiedFiles++;
            console.log('Modified:', filePath);
        }
    }
});

console.log(`\nProcessed ${totalFiles} files. Modified ${modifiedFiles} files.`);
