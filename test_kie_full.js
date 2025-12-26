
async function testKieFullFlow() {
    const API_KEY = "e9c4ddf39afc4802d940405b927297db";
    const BASE_URL = "https://api.kie.ai/api/v1/jobs";

    // 1. Create Task
    console.log("Creating Task...");
    const createPayload = {
        "model": "nano-banana-pro",
        "input": {
            "prompt": "Test postcard generation from script",
            "aspect_ratio": "1:1",
            "output_format": "png"
        }
    };

    let taskId = "";
    try {
        const res = await fetch(`${BASE_URL}/createTask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify(createPayload)
        });
        const data = await res.json();
        if (data.code !== 200) {
            console.error("Create Failed:", data);
            return;
        }
        taskId = data.data.taskId;
        console.log(`Task Created! ID: ${taskId}`);
    } catch (e) {
        console.error("Create Error:", e);
        return;
    }

    // 2. Poll for Status
    console.log("Polling for status...");
    const maxAttempts = 30;
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const queryRes = await fetch(`${BASE_URL}/recordInfo?taskId=${taskId}`, {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${API_KEY}` }
            });
            const queryData = await queryRes.json();

            if (queryData.code !== 200) {
                console.log("Query Error:", queryData);
                break;
            }

            const state = queryData.data.state;
            console.log(`Attempt ${i + 1}: State = ${state}`);

            if (state === 'success') {
                console.log("✅ GENERATION SUCCESS!");
                const result = JSON.parse(queryData.data.resultJson);
                console.log("Image URL:", result.resultUrls[0]);
                return;
            } else if (state === 'fail') {
                console.error("❌ GENERATION FAILED:", queryData.data.failMsg);
                return;
            }

            // Wait 2 seconds
            await new Promise(r => setTimeout(r, 2000));

        } catch (e) {
            console.error("Polling Error:", e);
        }
    }
}

testKieFullFlow();
