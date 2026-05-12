import fs from 'fs';

const raw = fs.readFileSync('raw.txt', 'utf8');

const blocks = raw.split(/\n\s*\n+/);

const parsedQuestions = [];

let id = 1;

for (const block of blocks) {
  const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) continue;
  
  const numOptions = 4;
  if (lines.length < 5) {
    console.log("Warning: block length < 5", lines);
    // Try to handle it gracefully
    if (lines.length <= 1) continue;
  }
  
  const optionsLines = lines.slice(-numOptions);
  const questionLines = lines.slice(0, lines.length - numOptions);
  
  const text = questionLines.join(' ');
  const options = [];
  let correctAnswer = '';
  
  for (const opt of optionsLines) {
    if (opt.startsWith('#')) {
      const cleanOpt = opt.substring(1).trim();
      options.push(cleanOpt);
      correctAnswer = cleanOpt;
    } else {
      options.push(opt);
    }
  }
  
  parsedQuestions.push({
    id: id++,
    text,
    options,
    correctAnswer
  });
}

const exportData = `export const subjectsData = [
  {
    id: "f1",
    name: "Gidrometriya (Real savollar)",
    questions: ${JSON.stringify(parsedQuestions, null, 2)}
  }
];
`;

fs.writeFileSync('src/data.js', exportData);
console.log("Parsed " + parsedQuestions.length + " questions.");
