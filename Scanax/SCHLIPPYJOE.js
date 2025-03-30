let gifSource = document.getElementById('gif-source');

let previewBut = document.getElementById('imageInput');
previewBut.addEventListener("change", previewfunction);

let apiBut = document.getElementById('api-but');
apiBut.addEventListener("click", processImage);

let imgpreviewURL = '';
function previewfunction() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) {
        document.getElementById('imagePreview').src = URL.createObjectURL(file);
        imgpreviewURL = URL.createObjectURL(file);
    } else {
        document.getElementById('imagePreview').src = "";
    }
}

function sendimagefunction() {
    gifSource.src = "gifs/thoughts.png";
    let topContainer = document.getElementsByClassName("top-half");
    topContainer[0].style.backgroundColor = "white";
}

function recfunction() {
    gifSource.src = "gifs/complete.png";
}

async function sendImageToGemini(apiKey, imageData) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                inlineData: {
                                    mimeType: imageData.mimeType,
                                    data: imageData.data,
                                },
                            },
                            {
                                text: `Analyze the pill bottle image. Extract the medication name, pill count, and usage instructions. 
                                look up warnings about this medication such as usage or abuse or side effects and put them in warnings
                                describe what the pills may look like to someone who is visually impared for description
                                calculate how long until the medication is finished in finished time
                                find me a URL of an image I can display for what the medication looks like, if not send back an empty string
                                provide the following information in JSON format,
                                with all keys and string values enclosed in double quotes:
                                {
                                  "medicationName": "...",
                                  "pillCount": "...",
                                  "instructions": "...",
                                  "warnings": "...",
                                  "description": "...",
                                  "finishTime": "...",
                                  "pillImageUrl": "..."
                                }`,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Gemini Vision API Error Response:", errorData);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Gemini Vision API Response:", data);

        if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
            recfunction();
            console.log("Extracted Text:", data.candidates[0].content.parts[0].text);

            let resultText = data.candidates[0].content.parts[0].text;
            let resultBox = document.getElementById('result-cont');
            resultBox.id = 'result-contTWO';


            document.getElementById('imageContainer').id = 'imageContainerTWO';

            let buttoncontainer = document.getElementsByClassName('bot-cont');
            buttoncontainer[0].className = "bot-contTWO";

            let topcontainer = document.getElementsByClassName('top-cont');
            topcontainer[0].className = "top-contTWO";

            let OGimg = document.getElementById('OG-img');
            OGimg.src = imgpreviewURL;



            let jsonString = data.candidates[0].content.parts[0].text;


            // Remove markdown code blocks
            jsonString = jsonString.replace(/```json\n/g, '');
            jsonString = jsonString.replace(/```/g, '');

            // Remove any leading/trailing whitespace
            jsonString = jsonString.trim();

            try {
                const jsonResponse = JSON.parse(jsonString);
                console.log("Extracted JSON:", jsonResponse);

                // Assuming jsonResponse is the parsed JSON object
                console.log("help e eat the eer");

                const medicationName = jsonResponse.medicationName;
                const pillCount = jsonResponse.pillCount;
                const instructions = jsonResponse.instructions;
                const warnings = jsonResponse.warnings;
                const description = jsonResponse.description;
                const finishTime = jsonResponse.finishTime;
                const pillImageUrl = jsonResponse.pillImageUrl;

                // Example usage:
                console.log("Medication Name:", medicationName);
                console.log("Pill Count:", pillCount);
                console.log("Instructions:", instructions);
                console.log("Warnings:", warnings);
                console.log("Description:", description);
                console.log("Finish Time:", finishTime);
                console.log("Pill Image URL:", pillImageUrl);

                let AIimg = document.getElementById('ai-img');
                AIimg.src = pillImageUrl;


                let drugNameText = document.querySelectorAll(".slide .text-cont")[0];
                let amountText = document.querySelectorAll(".slide .text-cont")[1];
                let instructionsText = document.querySelectorAll(".slide .text-cont")[2];
                let warningsText = document.querySelectorAll(".slide .text-cont")[3];
                let refillText = document.querySelectorAll(".slide .text-cont")[4];
                let descriptionText = document.querySelectorAll(".slide .text-cont")[5];

                // Example usage to change text content:
                drugNameText.textContent = medicationName;
                amountText.textContent = pillCount;
                instructionsText.textContent = instructions;
                warningsText.textContent = warnings;
                refillText.textContent = finishTime;
                descriptionText.textContent = description;

                


                return jsonResponse;

            } catch (jsonError) {
                console.error("Error parsing JSON:", jsonError);
                console.log("Raw Response:", jsonString);
                return null;
            }

        } else {
            console.log("No text found in the image or no text in the response");
            return null;
        }

    } catch (error) {
        console.error("Error calling Gemini Vision API:", error);
        return null;
    }
}

function processImage() {
    sendimagefunction();
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an image.');
        return;
    }

    const reader = new FileReader();

    reader.onload = async function (event) { // Make the onload function async.
        const base64Image = event.target.result;
        document.getElementById('imagePreview').src = base64Image;

        const imageData = {
            mimeType: file.type,
            data: base64Image.split(',')[1],
        };

        const apiKey = "AIzaSyCGwZB0cqw_ZgYJkDnVxUUh1CrK4WqqobU"; // Replace with your actual API key.
        await sendImageToGemini(apiKey, imageData); // Wait for the API call to complete.
    };

    reader.onerror = function (event) {
        console.error('Error reading image:', event.target.error);
        alert('An error occurred while reading the image.');
    };

    reader.readAsDataURL(file);
}