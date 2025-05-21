document.getElementById('downloadBtn').addEventListener('click', async () => {
  const url = document.getElementById('videoUrl').value;
  const format = document.getElementById('format').value;
  
  if (!url) {
    alert('ဗီဒီယိုလင့်ခ်ထည့်ပေးပါ');
    return;
  }

  // UI Update
  const btn = document.getElementById('downloadBtn');
  btn.disabled = true;
  btn.textContent = 'ဒေါင်းလုပ်လုပ်နေသည်...';
  
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const statusText = document.getElementById('statusText');
  
  progressContainer.classList.remove('d-none');
  statusText.textContent = 'စတင်နေပါသည်...';

  try {
    // yt-dlp initialization
    if (typeof YtDlp === 'undefined') {
      throw new Error('yt-dlp library မရှိပါ');
    }
    
    const ytdl = await YtDlp.create();
    const info = await ytdl.getInfo(url);
    const title = info.title.replace(/[^\w\s]/gi, '');
    
    const options = {
      format: format === 'mp3' ? 'bestaudio' : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]',
      output: `${title}.${format}`
    };
    
    // Real download with progress
    const result = await ytdl.download(url, options, (progress) => {
      const percent = Math.round(progress * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent}%`;
      statusText.textContent = `ဒေါင်းလုပ်လုပ်နေသည် ${percent}%`;
    });
    
    // Show download link
    const downloadLink = document.getElementById('downloadLink');
    downloadLink.href = URL.createObjectURL(result.blob);
    downloadLink.download = `${title}.${format}`;
    downloadLink.textContent = `${title}.${format} ဒေါင်းလုပ်လုပ်မည်`;
    
    document.getElementById('resultContainer').classList.remove('d-none');
    statusText.textContent = 'ဒေါင်းလုပ်ပြီးပါပြီ!';
    
  } catch (error) {
    statusText.textContent = `အမှားတစ်ခုဖြစ်နေပါသည်: ${error.message}`;
    progressBar.classList.add('bg-danger');
    console.error('Download error:', error);
  } finally {
    btn.disabled = false;
    btn.textContent = 'နောက်တစ်ခုဒေါင်းလုပ်လုပ်မည်';
  }
});
