const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI("AIzaSyAZZtY1Z9qyVBhbm7Sp337DKuNyOgAfvPM");

    const modelsToTest = [
        "gemini-3-pro-preview",
        "gemini-2.0-flash-exp"
    ];

    const dummyImagePart = {
        inlineData: {
            data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
            mimeType: "image/png"
        }
    };

    for (const modelName of modelsToTest) {
        console.log(`Testing multimodal: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(["Describe this image", dummyImagePart]);
            const response = await result.response;
            console.log(`✅ MULTIMODAL SUCCESS: ${modelName}`);
        } catch (error) {
            console.log(`❌ MULTIMODAL FAILED: ${modelName} - ${error.message.split(' ').slice(0, 20).join(' ')}...`);
        }
    }
}

listModels();
