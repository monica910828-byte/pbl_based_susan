const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const apiKeyLine = envContent.split('\n').find(line => line.startsWith('VITE_OPENAI_API_KEY') || line.startsWith('OPENAI_API_KEY'));
if (!apiKeyLine) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

const apiKey = apiKeyLine.split('=')[1].trim();

async function checkModels() {
  try {
    const res = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    const data = await res.json();
    if (data.error) {
      console.error("API Error:", data.error);
    } else {
      const dalleModels = data.data.filter(m => m.id.includes('dall')).map(m => m.id);
      console.log("Available DALL-E models:", dalleModels);
      if (dalleModels.length === 0) {
         console.log("NO DALL-E models found! The key likely does not have Tier 1 access.");
      }
    }
  } catch(e) {
    console.error(e);
  }
}

checkModels();
