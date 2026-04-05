const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = [
  // Backgrounds
  { regex: /\bbg-slate-950(\/[0-9]+)?\b/g, replacement: 'bg-white$1' },
  { regex: /\bbg-slate-900(\/[0-9]+)?\b/g, replacement: 'bg-white$1' },
  { regex: /\bbg-slate-800(\/[0-9]+)?\b/g, replacement: 'bg-slate-50$1' },
  { regex: /\bhover:bg-slate-800\b/g, replacement: 'hover:bg-slate-100' },
  { regex: /\bhover:bg-slate-700\b/g, replacement: 'hover:bg-slate-200' },
  
  // Borders
  { regex: /\bborder-slate-800\b/g, replacement: 'border-slate-200' },
  { regex: /\bborder-slate-700\b/g, replacement: 'border-slate-300' },
  { regex: /\bdivide-slate-800\b/g, replacement: 'divide-slate-200' },

  // Text colors
  { regex: /\btext-slate-50\b/g, replacement: 'text-slate-900' },
  { regex: /\btext-slate-100\b/g, replacement: 'text-slate-900' },
  { regex: /\btext-slate-200\b/g, replacement: 'text-slate-800' },
  { regex: /\btext-slate-300\b/g, replacement: 'text-slate-600' },
  { regex: /\btext-slate-400\b/g, replacement: 'text-slate-500' },
  { regex: /\btext-white\b/g, replacement: 'text-slate-900' },
  { regex: /\btext-gray-400\b/g, replacement: 'text-slate-500' },

  // Rings / focus
  { regex: /\bfocus:ring-slate-700\b/g, replacement: 'focus:ring-slate-300' },
  { regex: /\bring-slate-700\b/g, replacement: 'ring-slate-200' },
  { regex: /\bring-slate-800\b/g, replacement: 'ring-slate-200' }
];

// Reverting text-white for elements that specifically need it (like Buttons with blue background)
// This will require manual fixing or a more targeted regex. Let's do a basic broad stroke first.

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      for (const { regex, replacement } of replacements) {
        content = content.replace(regex, replacement);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath.replace(__dirname, '')}`);
      }
    }
  }
}

console.log('Starting migration...');
processDirectory(srcDir);
console.log('Migration completed.');
