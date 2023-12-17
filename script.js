document.getElementById('image-input').addEventListener('change', function(event) {
    const inputLabel = document.querySelector('label[for="image-input"]');
    const fileName = event.target.files[0].name;
    inputLabel.textContent = fileName;
});

document.getElementById('image-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('image-input');
    const formatSelect = document.getElementById('format-select');
    const file = fileInput.files[0];
    const format = formatSelect.value;
    if (file) {
        convertImage(file, format);
    } else {
        alert('Please select an image to convert.');
    }
});

function convertImage(file, format) {
    const reader = new FileReader();
    reader.onload = function(event) {
        const img = document.createElement('img');
        img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(function(blob) {
                const newFileName = file.name.split('.').slice(0, -1).join('.') + '_converted.' + format;
                const newFile = new File([blob], newFileName, { type: 'image/' + format });

                const downloadLink = document.getElementById('download-link');
                const previewButton = document.getElementById('preview-button');
                const objectURL = URL.createObjectURL(newFile);
                downloadLink.href = objectURL;
                downloadLink.download = newFileName;
                previewButton.onclick = function() {
                    const imagePreview = new Image();
                    imagePreview.src = objectURL;
                    imagePreview.style.maxHeight = '500px';
                    imagePreview.className = 'img-fluid rounded';
                    document.getElementById('preview-container').appendChild(imagePreview);
                };
                previewButton.style.display = 'inline-block';
                downloadLink.style.display = 'inline-block';
                downloadLink.textContent = 'Download';

                const messageDiv = document.getElementById('conversion-message');
                messageDiv.className = 'alert alert-success';
                messageDiv.textContent = 'Image converted successfully!';
                messageDiv.style.display = 'block';

                window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                previewButton.focus();
            }, 'image/' + format);
        };
        img.onerror = function() {
            showError('Error converting image.');
        };
        img.src = event.target.result;
    };
    reader.onerror = function() {
        showError('Error reading image.');
    };
    reader.readAsDataURL(file);
}

function showError(message) {
    const messageDiv = document.getElementById('conversion-message');
    messageDiv.className = 'alert alert-danger';
    messageDiv.textContent = message;
    messageDiv.style.display = 'block';
}