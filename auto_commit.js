const fs = require('fs');
const axios = require('axios');
const { execSync } = require('child_process');

const API_KEY = '73277aeda06202693fb83b0ca5fcaa49';
const API_URL = 'https://favqs.com/api/qotd';

// Fetch a random quote
async function fetchQuote() {
  try {
    const response = await axios.get(API_URL, {
      headers: { 'Authorization': `Token token="${API_KEY}"` }
    });
    if (response.status === 200 && response.data.quote) {
      const quoteData = response.data.quote;
      return `${quoteData.body} - ${quoteData.author}`;
    } else {
      return 'Tidak ada kutipan hari ini.';
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
    return 'Error fetching quote.';
  }
}

// Write the quote and add a random string to ensure unique changes
function writeQuoteToFile(quote) {
  const randomString = Math.floor(1000 + Math.random() * 9000).toString();
  fs.writeFileSync('RANDOM_QUOTE.txt', `${quote}\n${randomString}`);
}

// Commit changes
function commitChanges(quote, index) {
  try {
    execSync('git add RANDOM_QUOTE.txt');
    execSync(`git commit -m "Automated commit #${index}: ${quote}"`);
    console.log(`Commit #${index} berhasil: ${quote}`);
  } catch (error) {
    console.error(`Error pada commit #${index}:`, error.message);
    throw error;
  }
}

// Main script
(async () => {
  const numCommits = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10

  for (let i = 1; i <= numCommits; i++) {
    const quote = await fetchQuote();
    writeQuoteToFile(quote);
    try {
      commitChanges(quote, i);
    } catch (error) {
      console.error('Gagal menyelesaikan commit. Berhenti.');
      break;
    }
  }

  console.log(`Total commits hari ini: ${numCommits}`);
})();
