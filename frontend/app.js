// Function that opens a separate html window for uploading
function uploadFit() {
    const width = 500;
    const height = 600;

    const left = (screen.width - width) / 2;
    const top = (screen.height - height) / 2;

    const uploadWindow = window.open(
        "upload.html", 
        "UploadFit",
        `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no`
    );

    if (uploadWindow) {
        uploadWindow.focus();
    }
}

// Manages upload and random buttons functionality
document.addEventListener("DOMContentLoaded", function () {
    const uploadBtn = document.getElementById("uploadBtn");
    const randomBtn = document.getElementById("randomBtn");
    const gallery = document.getElementById("gallery");

    let uploadedFits = [];

    // File upload dialog after click upload button
    uploadBtn.addEventListener("click", function () {
        window.open("upload.html", "_blank", "width=500,height=600");
    });

    // Submitted fits from the upload window
    window.addEventListener("message", function (event) {
        if (event.data.type == "submitFit") {
            const { imageSrc, vibe, description, rating } = event.data;

            const fitData = {
                imageSrc: `C:/Users/ianle/OneDrive - DEPED NCR-1/Documents/University Files/BSIT - 2A/2ND SEM/Applications Development and Emerging Technologies/LAB/CC223_WebApp/backend/pictures/${imageSrc}`,
                vibe,
                description,
                rating
            };

            uploadedFits.push(fitData);
            fetchFits();
        }
    });

    // Fetch 3 random fits and display
    randomBtn.addEventListener("click", fetchFits);

    function fetchFits() {
        const gallery = document.getElementById("gallery");
        gallery.innerHTML = "";

        // Use the local IP address of your computer instead of 'localhost'
        const serverUrl = 'http://192.168.100.76:8000';

        fetch(`${serverUrl}/getImages`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(imageFiles => {
                if (imageFiles.length === 0) {
                    gallery.innerHTML = "<p>No images found.</p>";
                    return;
                }

                // Shuffle images
                const shuffledImages = imageFiles.sort(() => 0.5 - Math.random()).slice(0, 3);

                // Loop through shuffled images
                shuffledImages.forEach((image) => {
                    const fitContainer = document.createElement('div');
                    fitContainer.classList.add("fit-item");

                    // Build the image URL and append to gallery
                    const img = document.createElement('img');
                    img.src = `${serverUrl}/pictures/${image}`;
                    img.alt = "Random Fit";

                    // Add error handling for image loading
                    img.onerror = () => {
                        console.error(`Failed to load image: ${img.src}`);
                        img.alt = "Failed to load image";
                    };

                    fitContainer.appendChild(img);
                    gallery.appendChild(fitContainer);
                });
            })
            .catch(error => {
                console.error("Error fetching images:", error);
                gallery.innerHTML = "<p>Error fetching images.</p>";
            });
    }

    // Automatically randomizes photos when starting the website
    fetchFits();
});