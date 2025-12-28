import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { doctorUrl, childUrl, scenario, customPrompt, aspectRatio = "1:1" } = body;

        const apiKey = process.env.KIE_AI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Server Configuration Error: Missing API Key" }, { status: 500 });
        }
        const baseUrl = "https://api.kie.ai/api/v1/jobs";

        // ENHANCED PROMPT FOR PHOTOREALISM & TURKISH TEXT
        const fullPrompt = `
          hyper-realistic photo of a doctor and a child celebrating "Medicine Day" in a ${scenario} setting.
          If there is any text in the image, it MUST be in TURKISH (e.g., "Tıp Bayramı", "Teşekkürler", "14 Mart", "İyi ki Varsınız"). 
          The scene should be natural and festive.
          ${customPrompt || "A heartwarming, happy moment."}
          style: raw photo, dslr, 8k, ultra detailed, sharp focus, professional lighting, cinematic composition.
          negative prompt: English text, "Happy Medicine Day", "Happy Doctor Day", foreign language text, cartoon, illustration, drawing, painting, 3d render, anime, low quality, blurry, distorted faces, spelling mistakes.
        `.trim();

        // PARALLEL REQUESTS (Generate 4 Variants)
        const generateVariant = async (index: number) => {
            console.log(`Starting generation for variant ${index + 1}...`);

            // Create Task
            const inputPayload = {
                "model": "nano-banana-pro",
                "input": {
                    "prompt": fullPrompt,
                    "aspect_ratio": aspectRatio,
                    "output_format": "png",
                    "image_input": [doctorUrl, childUrl],
                    "seed": Math.floor(Math.random() * 1000000) // Random seed for variety
                }
            };

            const createRes = await fetch(`${baseUrl}/createTask`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`
                },
                body: JSON.stringify(inputPayload)
            });

            const createData = await createRes.json();
            if (createData.code !== 200) throw new Error(`Create Failed: ${createData.message}`);

            const taskId = createData.data.taskId;

            // Poll for Completion
            const startTime = Date.now();
            while (Date.now() - startTime < 90000) { // 90s timeout
                const pollRes = await fetch(`${baseUrl}/recordInfo?taskId=${taskId}`, {
                    headers: { "Authorization": `Bearer ${apiKey}` }
                });
                const pollData = await pollRes.json();

                if (pollData.code === 200) {
                    const state = pollData.data.state;
                    if (state === "success") {
                        const result = JSON.parse(pollData.data.resultJson);
                        return result.resultUrls[0];
                    } else if (state === "fail") {
                        throw new Error(`Generation Failed: ${pollData.data.failMsg}`);
                    }
                }
                await new Promise(r => setTimeout(r, 2500)); // Wait 2.5s
            }
            throw new Error("Timeout");
        };

        // Execute 4 requests in parallel
        console.log("Launching 4 parallel generation tasks...");
        const results = await Promise.allSettled([
            generateVariant(0),
            generateVariant(1),
            generateVariant(2),
            generateVariant(3)
        ]);

        const successfulImages = results
            .filter(r => r.status === "fulfilled")
            .map(r => (r as PromiseFulfilledResult<string>).value);

        if (successfulImages.length === 0) {
            // Log failed generation
            const { logApiUsage } = await import("@/lib/firebase");
            await logApiUsage({
                timestamp: new Date(),
                scenario: scenario || "unknown",
                aspectRatio: aspectRatio,
                imageCount: 0,
                status: "error",
                errorMessage: "All generation attempts failed"
            });
            throw new Error("All generation attempts failed.");
        }

        // Log successful generation
        const { logApiUsage } = await import("@/lib/firebase");
        await logApiUsage({
            timestamp: new Date(),
            scenario: scenario || "unknown",
            aspectRatio: aspectRatio,
            imageCount: successfulImages.length,
            status: "success"
        });

        return NextResponse.json({
            success: true,
            images: successfulImages, // Return array of images
            description: fullPrompt
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: `Failed to generate: ${error.message}` },
            { status: 500 }
        );
    }
}
