const fs = require('fs');
const file = '/Users/vinaysharma/Desktop/airion/apps/user-website/src/pages/VendorDiscovery.tsx';
let content = fs.readFileSync(file, 'utf8');

// Remove Layers from import
content = content.replace(/, Layers /g, ' ');

// Remove SwipeView component definition
const lines = content.split('\n');
const startIdx = lines.findIndex(l => l.startsWith('const SwipeView: React.FC'));
let endIdx = startIdx;
if (startIdx !== -1) {
    let braceCount = 0;
    let started = false;
    for (let i = startIdx; i < lines.length; i++) {
        const line = lines[i];
        for (let char of line) {
            if (char === '{') { braceCount++; started = true; }
            if (char === '}') braceCount--;
        }
        if (started && braceCount === 0) {
            endIdx = i;
            break;
        }
    }
    lines.splice(startIdx, endIdx - startIdx + 1);
}

fs.writeFileSync(file, lines.join('\n'));
console.log('Cleaned up SwipeView');
