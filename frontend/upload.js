let selectedRating = 0;

// Handle star ratings
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', function () {
        selectedRating = this.getAttribute('data-value');
        document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
        for (let i = 0; i < selectedRating; i++) {
            document.querySelectorAll('.star')[i].classList.add('active');
        }
    });
});

// Preview image on file select
document.getElementById("file-upload").addEventListener("change", function (event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("preview").src = e.target.result;
            document.getElementById("preview").style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// Submit the chosen fit photo
async function submitFit() {
    const fileInput = document.getElementById("file-upload");
    const vibe = document.getElementById("vibe").value;
    const description = document.getElementById("description").value;

    if (!fileInput.files.length) {
        alert("No file selected. Please select a file!");
        return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);  // Fixed field name
    formData.append("vibe", vibe);
    formData.append("description", description);
    formData.append("rating", selectedRating); 

    try {
        const response = await fetch("http://localhost:8000/upload", { 
            method: "POST",
            body: formData
        });

        const result = await response.json();
        if (result.imageSrc) {  
            window.opener.postMessage({
                type: "submitFit",
                imageSrc: result.imageSrc,
                vibe,
                description,
                rating: selectedRating
            }, "*");
            alert("Fit uploaded 👖")
            window.close();
        } else {
            alert("Failed to upload the image.");
        }
    } catch (error) {
        console.error("Error uploading.", error);
        alert("Upload error.");
    }
}
