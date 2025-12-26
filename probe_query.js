
async function probeQueryTask() {
    const API_KEY = "e9c4ddf39afc4802d940405b927297db";
    const BASE_URL = "https://api.kie.ai/api/v1/jobs";
    const TASK_ID = "d3d3d6e4a92a8ae779d97d04f4a97937"; // From previous success

    console.log(`Probing Query Task for ID: ${TASK_ID}`);

    // Common patterns for query endpoints
    const endpoints = [
        `${BASE_URL}/getTask?taskId=${TASK_ID}`,
        `${BASE_URL}/queryTask?taskId=${TASK_ID}`,
        `${BASE_URL}/task/${TASK_ID}`,
        `${BASE_URL}/tasks/${TASK_ID}`
    ];

    for (const url of endpoints) {
        console.log(`Trying: ${url}`);
        try {
            const response = await fetch(url, {
                method: 'GET', // or POST, sometimes query endpoints are POST
                headers: { 'Authorization': `Bearer ${API_KEY}` }
            });
            if (response.status === 200) {
                const data = await response.json();
                console.log("✅ SUCCESS:", url);
                console.log(JSON.stringify(data, null, 2));
                return;
            } else {
                console.log(`❌ ${response.status} - ${response.statusText}`);
            }
        } catch (e) { console.log("Error:", e.message); }
    }
}

probeQueryTask();
