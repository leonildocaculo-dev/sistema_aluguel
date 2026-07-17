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
    let changed = false;
    
    replacements.forEach(r => {
        // match ui/Button or ui/Card
        const regex = new RegExp('ui/' + r + '(?=[\'\"])', 'g');
        if (regex.test(content)) {
            content = content.replace(regex, 'ui/' + r.toLowerCase());
            changed = true;
        }
        
        // match ./Button or ./Card inside components/ui
        const regex2 = new RegExp('\\./' + r + '(?=[\'\"])', 'g');
        if (file.includes('components\\\\ui') || file.includes('components/ui')) {
            if (regex2.test(content)) {
                content = content.replace(regex2, './' + r.toLowerCase());
                changed = true;
            }
        }
    });
    
    if (changed) {
        fs.writeFileSync(file, content);
        changedFiles++;
    }
});
console.log('Changed ' + changedFiles + ' files');
