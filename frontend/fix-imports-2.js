const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
const replacements = ['Button', 'Card', 'Input', 'Popover', 'Calendar', 'Checkbox', 'Label', 'Skeleton', 'Slider', 'Separator', 'Badge'];

let changedFiles = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    replacements.forEach(r => {
        const regex1 = new RegExp('ui/' + r + '([\'\"])', 'g');
        content = content.replace(regex1, 'ui/' + r.toLowerCase() + '$1');
        
        const regex2 = new RegExp('\\./' + r + '([\'\"])', 'g');
        if (file.includes('components\\\\ui') || file.includes('components/ui')) {
            content = content.replace(regex2, './' + r.toLowerCase() + '$1');
        }
    });
    
    if (content !== originalContent) {
        fs.writeFileSync(file, content);
        changedFiles++;
    }
});
console.log('Changed ' + changedFiles + ' files via fixed script');
