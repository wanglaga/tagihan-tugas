const socket = io();

socket.on('updateData', function (data) {
  const kelasURL = window.location.pathname.split('/').pop();
  const siswa = data.filter(s => s.kelas == kelasURL);
  
  const container = document.getElementById('card-container');
  if (!container) return;

  let html = '';
  siswa.forEach(s => {
    html += `
      <div class="card">
        <div class="card-header">${s.nama} | Kelas ${s.kelas}</div>
        <div class="card-body">
    `;
    const mp = s.mata_pelajaran || {};
    const entries = Object.entries(mp).filter(([_, val]) => val && val !== "TIDAK ADA TUGAS");
    if (entries.length > 0) {
      entries.forEach(([mapel, tugas]) => {
        html += `<p><strong>${mapel}:</strong></p><ul>`;
        tugas.split('\n').forEach(item => {
          html += `<li>${item.trim()}</li>`;
        });
        html += '</ul>';
      });
    } else {
      html += '<p class="no-task">Tidak ada tugas</p>';
    }
    html += `</div></div>`;
  });

  container.innerHTML = html;
});
