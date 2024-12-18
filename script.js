// 获取DOM元素
const fileInput = document.getElementById('fileInput');
const uploadArea = document.getElementById('uploadArea');
const uploadBox = document.querySelector('.upload-box');
const previewContainer = document.querySelector('.preview-container');
const originalPreview = document.getElementById('originalPreview');
const compressedPreview = document.getElementById('compressedPreview');
const originalSize = document.getElementById('originalSize');
const compressedSize = document.getElementById('compressedSize');
const qualitySlider = document.getElementById('qualitySlider');
const qualityValue = document.getElementById('qualityValue');
const downloadBtn = document.getElementById('downloadBtn');

// 当前处理的图片数据
let currentImage = null;

// 绑定上传事件
uploadBox.addEventListener('click', () => fileInput.click());
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#007AFF';
});

uploadArea.addEventListener('dragleave', () => {
    uploadBox.style.borderColor = '#ddd';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.style.borderColor = '#ddd';
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

// 处理图片上传
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = new Image();
        currentImage.src = e.target.result;
        currentImage.onload = () => {
            originalPreview.src = currentImage.src;
            originalSize.textContent = formatFileSize(file.size);
            compressImage();
            previewContainer.style.display = 'block';
        };
    };
    reader.readAsDataURL(file);
}

// 压缩图片
function compressImage() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = currentImage.width;
    canvas.height = currentImage.height;
    
    ctx.drawImage(currentImage, 0, 0);
    
    const quality = qualitySlider.value / 100;
    const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
    
    compressedPreview.src = compressedDataUrl;
    
    // 计算压缩后的大小
    const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
    const compressedBytes = base64Length * 0.75;
    compressedSize.textContent = formatFileSize(compressedBytes);
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// 监听滑块变化
qualitySlider.addEventListener('input', () => {
    qualityValue.textContent = qualitySlider.value + '%';
    if (currentImage) {
        compressImage();
    }
});

// 下载压缩后的图片
downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'compressed-image.jpg';
    link.href = compressedPreview.src;
    link.click();
}); 