let gifSource = document.getElementById('gif-source');

let previewBut = document.getElementById('imageInput');
previewBut.addEventListener("change", previewfunction);

let apiBut = document.getElementById('api-but');
apiBut.addEventListener("click", processImage);

function previewfunction() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) {
        document.getElementById('imagePreview').src = URL.createObjectURL(file);
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
                                text: "What text is in this image?",
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
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



            

        } else {
            console.log("No text found in the image or no text in the response");
        }

    } catch (error) {
        console.error("Error calling Gemini Vision API:", error);
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