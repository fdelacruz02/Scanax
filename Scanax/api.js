let gifSource = document.getElementById('gif-source');

let previewBut = document.getElementById('imageInput');
previewBut.addEventListener("change", previewfunction);

let sendButtonCust = document.getElementById('send-but');
sendButtonCust.addEventListener('click', sendimagefunction);

let recBut = document.getElementById('rec-but');
recBut.addEventListener("click", recfunction);


let apiBut = document.getElementById('api-but');
apiBut.addEventListener("click", apicall);


function previewfunction() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];

    if (file) { // Add a check to ensure a file was selected
        document.getElementById('imagePreview').src = URL.createObjectURL(file);
    } else {
      document.getElementById('imagePreview').src = ""; // Clear the preview if no file is selected
    }
}

function sendimagefunction(){
    gifSource.src = "gifs/thoughts.png";
    let topContainer = document.getElementsByClassName("top-half");
    topContainer[0].style.backgroundColor = "white";
}

function recfunction(){
    gifSource.src = "gifs/complete.png";
}


function apicall(){
  console.log("prressed");
  async function callGeminiAPI(apiKey, prompt) {
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + apiKey;
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log("Gemini API Response:", data);
      // process the data.
      if(data.candidates && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text){
        console.log("Generated Text:", data.candidates[0].content.parts[0].text);
      } else {
        console.log("no text in the response");
      }
  
    } catch (error) {
      console.error("Error calling Gemini API:", error);
    }
  }
  
  // Example usage:
  const apiKey = "AIzaSyCGwZB0cqw_ZgYJkDnVxUUh1CrK4WqqobU"
  const prompt = "Write a short poem about the ocean.";
  
  callGeminiAPI(apiKey, prompt);
}


function processImage() {
    const fileInput = document.getElementById('imageInput');
    const file = fileInput.files[0];
  
    if (!file) {
      alert('Please select an image.');
      return;
    }
  
    const reader = new FileReader();
  
    reader.onload = function(event) {
      const base64Image = event.target.result; 
      document.getElementById('imagePreview').src = base64Image;
  
      //Preparing data for an API (not sending it yet)
      const imageData = {
        mimeType: file.type,
        data: base64Image.split(',')[1],
      };

        fetch("your_php_script.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: "imageData=" + encodeURIComponent(JSON.stringify(imageData)),
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            //...process the data from the php.
        });

    };
  
    reader.onerror = function(event) {
      console.error('Error reading image:', event.target.error);
      alert('An error occurred while reading the image.');
    };
  
    reader.readAsDataURL(file); // Read the image as a data URL (base64).
  }