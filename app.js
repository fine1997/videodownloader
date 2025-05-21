// app.js - Real Working Version for Android Phone
document.getElementById('downloadBtn').addEventListener('click', async function() {
  const url = document.getElementById('videoUrl').value;
  const format = document.getElementById('format').value;
  
  if (!url) {
    alert('ဗီဒီယိုလင့်ခ်ထည့်ပေးပါ!');
    return;
  }
  
  // UI အပြောင်းအလဲများ
  const btn = document.getElementById('downloadBtn');
  btn.disabled = true;
  btn.textContent = 'ဒေါင်းလုပ်လုပ်နေသည်...';
  
  const progressContainer = document.getElementById('progressContainer');
  const progressBar = document.getElementById('progressBar');
  const statusText = document.getElementById('statusText');
  
  progressContainer.style.display = 'block';
  statusText.textContent = 'ပြင်ဆင်နေသည်...';
  
  try {
    // 1. yt-dlp.wasm စစ်ဆေးခြင်း
    if (typeof YtDlp === 'undefined') {
      throw new Error('အင်တာနက်ချိတ်ဆက်မှုပြဿနာ');
    }
    
    // 2. Video အချက်အလက်ရယူခြင်း
    const ytdl = await YtDlp.create();
    const info = await ytdl.getInfo(url);
    const cleanTitle = info.title.replace(/[^\w\s]/gi, '').substring(0, 30);
    
    // 3. ဒေါင်းလုပ်ရွေးစရာများ
    const options = {
      format: format === 'mp3' ? 'bestaudio' : 'best[ext=mp4]',
      output: `${cleanTitle}.${format}`
    };
    
    // 4. အမှန်တကယ်ဒေါင်းလုပ်လုပ်ခြင်း
    const result = await ytdl.download(url, options, (progress) => {
      const percent = Math.round(progress * 100);
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent}%`;
      statusText.textContent = `ဒေါင်းလုပ်လုပ်နေသည် ${percent}%`;
    });
    
    // 5. File သိမ်းဆည်းနိုင်ရန် ပြင်ဆင်ခြင်း
    const downloadLink = document.getElementById('downloadLink');
    const blobUrl = URL.createObjectURL(result.blob);
    
    downloadLink.href = blobUrl;
    downloadLink.download = `${cleanTitle}.${format}`;
    downloadLink.textContent = `${cleanTitle}.${format} သိမ်းမည်`;
    downloadLink.onclick = () => {
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl); // Memory ရှင်းလင်းခြင်း
        statusText.textContent = 'သိမ်းဆည်းပြီးပါပြီ!';
      }, 1000);
    };
    
    document.getElementById('resultContainer').style.display = 'block';
    
  } catch (error) {
    statusText.textContent = `မအောင်မြင်ပါ: ${error.message}`;
    progressBar.style.background = '#dc3545';
    console.error('Download error:', error);
  } finally {
    btn.disabled = false;
    btn.textContent = 'နောက်တစ်ခုဒေါင်းလုပ်လုပ်မည်';
  }
});
