// app.js - Complete Working Version for Spck Editor (Android)
document.addEventListener('DOMContentLoaded', function() {
  // UI Elements
  const downloadBtn = document.getElementById('downloadBtn');
  const videoUrlInput = document.getElementById('videoUrl');
  const formatSelect = document.getElementById('format');
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const statusText = document.getElementById('statusText');
  const resultContainer = document.getElementById('resultContainer');
  const downloadLink = document.getElementById('downloadLink');

  // Check if yt-dlp.wasm is loaded
  function checkDependencies() {
    if (typeof YtDlp === 'undefined') {
      throw new Error('yt-dlp.wasm library failed to load. Please check your internet connection.');
    }
  }

  // Sanitize filename
  function sanitizeFilename(title) {
    return title.replace(/[^\w\s-]/gi, '').substring(0, 30);
  }

  // Download handler
  downloadBtn.addEventListener('click', async function() {
    const url = videoUrlInput.value.trim();
    const format = formatSelect.value;

    // Validation
    if (!url) {
      alert('YouTube video URL ထည့်ပေးပါ!');
      return;
    }

    try {
      // UI Updates
      downloadBtn.disabled = true;
      downloadBtn.textContent = 'Processing...';
      progressContainer.style.display = 'block';
      statusText.textContent = 'Initializing...';

      // Check dependencies
      checkDependencies();

      // Initialize yt-dlp
      statusText.textContent = 'Loading yt-dlp...';
      const ytdl = await YtDlp.create();

      // Get video info
      statusText.textContent = 'Fetching video info...';
      const info = await ytdl.getInfo(url);
      const cleanTitle = sanitizeFilename(info.title);
      const filename = `${cleanTitle}.${format}`;

      // Download options
      const options = {
        format: format === 'mp3' ? 'bestaudio/best' : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        output: filename
      };

      // Start download
      statusText.textContent = 'Starting download...';
      const result = await ytdl.download(url, options, (progress) => {
        const percent = Math.round(progress * 100);
        progressBar.style.width = `${percent}%`;
        progressBar.textContent = `${percent}%`;
        statusText.textContent = `Downloading... ${percent}%`;
      });

      // Create download link
      const blobUrl = URL.createObjectURL(result.blob);
      downloadLink.href = blobUrl;
      downloadLink.download = filename;
      downloadLink.textContent = `Save: ${filename}`;
      
      // Clean up memory after download
      downloadLink.addEventListener('click', function() {
        setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          statusText.textContent = 'Download completed!';
        }, 1000);
      });

      // Show result
      resultContainer.style.display = 'block';
      statusText.textContent = 'Ready to download!';

    } catch (error) {
      console.error('Error:', error);
      statusText.textContent = `Error: ${error.message}`;
      progressBar.style.backgroundColor = '#ff4444';
      
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download Again';
    }
  });

  // Initialize status
  statusText.textContent = 'Enter YouTube URL and click Download';
});
