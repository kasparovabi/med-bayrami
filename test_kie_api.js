

async function testKieAI() {
    const API_KEY = "e9c4ddf39afc4802d940405b927297db"; // New Kie AI Key
    const BASE_URL = "https://api.kie.ai/api/v1/jobs";

    console.log(`Testing Kie AI with Key: ${API_KEY.substring(0, 10)}...`);

    const payload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": "Test postcard generation",
            "aspect_ratio": "1:1",
            "output_format": "png"
        }
    };

    try {
        const response = await fetch(`${BASE_URL}/createTask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        console.log("Create Task Response Status:", response.status);
        console.log("Create Task Body:", JSON.stringify(data, null, 2));

    } catch (error) {
        console.error("Request Failed:", error);
    }
}

testKieAI();
