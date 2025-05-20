// app.js (Advanced Version with yt-dlp.wasm)
async function downloadVideo(url, format, progressCallback) {
  // yt-dlp.wasm library ကိုသုံးပါ
  const ytdl = await YtDlp.create();
  
  // Video info ရယူခြင်း
  const info = await ytdl.getInfo(url);
  const title = info.title.replace(/[^\w\s]/gi, '');
  
  // Download options
  const options = {
    format: format === 'mp3' ? 'bestaudio' : 'bestvideo[ext=mp4]+bestaudio[ext=m4a]',
    output: `${title}.${format}`
  };
  
  // အမှန်တကယ် download လုပ်ခြင်း
  const result = await ytdl.download(url, options, progressCallback);
  
  return {
    downloadLink: URL.createObjectURL(result.blob),
    filename: `${title}.${format}`
  };
}