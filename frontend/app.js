document.addEventListener("DOMContentLoaded", function () {
    const uploadBtn = document.getElementById("uploadBtn");
    const randomBtn = document.getElementById("randomBtn");
    const gallery = document.getElementById("gallery");

    let uploadedFits = [];

    // File upload dialog after click upload button
    uploadBtn.addEventListener("click", function () {
        window.open("upload.html", "_blank", "width=500,height=600");
    });
})