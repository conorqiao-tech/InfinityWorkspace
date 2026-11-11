const $ = id => document.getElementById(id);
let selectedFile = null, proposal = null, busy = false, revision = 0;
const invalidate = () => { revision++; proposal = null; $('result').hidden = true; $('download').hidden = true; };
$('file').addEventListener('change', async event => {
  invalidate(); const fileRevision = revision; selectedFile = null; $('clear-file').hidden = true; const file = event.target.files[0];
  if (!file) return;
  if (file.size > 80_000) { $('file-info').textContent = 'File exceeds the 80 KB limit.'; event.target.value = ''; return; }
  try { const bytes = await file.arrayBuffer(); const content = new TextDecoder('utf-8', {fatal:true}).decode(bytes); if (fileRevision !== revision) return; if (content.includes('\0')) throw Error(); selectedFile = {name:file.name, content}; $('file-info').textContent = `${file.name} · ${file.size.toLocaleString()} bytes`; $('clear-file').hidden = false; } catch { if (fileRevision !== revision) return; $('file-info').textContent = 'Choose a UTF-8 text file.'; event.target.value = ''; $('clear-file').hidden = true; }
});
$('clear-file').onclick = () => { selectedFile = null; $('file').value = ''; $('file-info').textContent = 'No file selected'; $('clear-file').hidden = true; invalidate(); };
for (const b of document.querySelectorAll('[data-prompt]')) b.onclick = () => { $('message').value = b.dataset.prompt; $('message').focus(); invalidate(); };
$('message').addEventListener('input', invalidate); $('mode').addEventListener('change', invalidate);
$('send').onclick = async () => {
 if (busy) return; const key = $('key').value.trim(), message = $('message').value.trim(), mode = $('mode').value;
 if (!key || !message || (mode === 'edit' && !selectedFile)) { $('notice').textContent = 'Add an API key and request; edits also require a selected file.'; return; }
 invalidate(); const submittedRevision = revision; busy = true; $('send').disabled = true; $('notice').textContent = 'Working on your request…';
 try { const res = await fetch('/api/agent', {method:'POST', headers:{'Content-Type':'application/json'},body:JSON.stringify({key,message,mode,file:selectedFile})}); const data = await res.json(); if (revision !== submittedRevision) { $('notice').textContent = 'The request or file changed while the assistant was working. Submit again.'; return; } if (!res.ok) throw Error(data.error || 'Request failed.'); $('output').textContent = data.output; $('result-title').textContent = mode === 'edit' ? 'Proposed file content' : 'Response'; $('result').hidden = false; if (mode === 'edit') { proposal = {name:selectedFile.name, content:data.output}; $('download').hidden = false; } $('notice').textContent = mode === 'edit' ? 'Review the complete proposed content before downloading.' : ''; } catch(e) { $('notice').textContent = e.message || 'Request failed.'; } finally { busy = false; $('send').disabled = false; }
};
$('download').onclick = () => { if (!proposal) return; const url = URL.createObjectURL(new Blob([proposal.content], {type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href = url; a.download = proposal.name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); };
