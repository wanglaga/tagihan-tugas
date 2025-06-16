const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

const API_URL = 'https://script.google.com/macros/s/AKfycbyBIkpmX2fcMw-Cfgl-D7tjsD6yyFn4wTgNTaX1uf1guejPL9rG27D8r-QXke6tmLtG/exec?data=ketuntasan';

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/tugas', (req, res) => {
  res.render('tugas'); // akan menampilkan tugas.ejs
});

app.get('/kelas/:id', async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    const data = response.data;

    const kelas = req.params.id;
    const siswa = data.filter(s => s.kelas == kelas);

    res.render('kelas', { kelas, siswa, error: null });
  } catch (error) {
    res.render('kelas', { kelas: req.params.id, siswa: [], error: 'Gagal mengambil data dari API' });
  }
});

// SOCKET.IO UPDATE EVERY 2 SECONDS
setInterval(async () => {
  try {
    const response = await axios.get(API_URL);
    io.emit('updateData', response.data);
  } catch (err) {
    console.error('Gagal update realtime:', err.message);
  }
}, 2000);

http.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));
