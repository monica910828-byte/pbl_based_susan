const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf-8');
const apiKeyLine = envContent.split('\n').find(line => line.startsWith('VITE_OPENAI_API_KEY') || line.startsWith('OPENAI_API_KEY'));
if (!apiKeyLine) {
  console.error("No API key found in .env.local");
  process.exit(1);
}

const apiKey = apiKeyLine.split('=')[1].trim();

async function testGenerate() {
  try {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-image-1.5',
        prompt: "A cute cat",
        n: 1,
        size: '1024x1024'
      })
    });
    
    if (!res.ok) {
       const text = await res.text();
       console.log("Error response:", text);
    } else {
       const data = await res.json();
       console.log("Success! Image URL:", data.data[0].url);
    }
  } catch(e) {
    console.error("Fetch failed:", e);
  }
}

testGenerate();
