// Menangkap elemen HTML menggunakan const (karena elemennya tetap)
const inputTabungan = document.getElementById("inputTabungan");
const inputBulan = document.getElementById("inputBulan");
const tombolHitung = document.getElementById("tombolHitung");
const teksHasil = document.getElementById("teksHasil");
const daftarRiwayat = document.getElementById("daftarRiwayat");

// Wadah array untuk menyimpan riwayat (pakai let karena isinya bertambah terus)
let riwayatArray = [];

// Fungsi perhitungan (diberi nilai default = 0 agar bersih dari warning editor)
function hitungTotal(tabungan = 0, bulan = 0) {
    return tabungan * bulan;
}
inputTabungan.addEventListener("input", function() {
    // 1. Bersihkan titik atau karakter lain yang tidak perlu
    let angkaMentah = this.value.replaceAll(".", "").replaceAll(",", "");
    
    // 2. Jika kosong, biarkan kosong
    if (angkaMentah === "") {
        this.value = "";
        return;
    }
    
    // 3. Ubah ke format titik ribuan Indonesia (.toLocaleString)
    if (!isNaN(angkaMentah)) {
        this.value = Number(angkaMentah).toLocaleString("id-ID");
    }
});
// Aksi saat tombol hitung diklik
tombolHitung.addEventListener("click", function() {
    let nilaiTabungan = Number(inputTabungan.value.replaceAll(".", ""));
    let nilaiBulan = Number(inputBulan.value);
    // Pengecekan menggunakan IF-ELSE
    if (nilaiTabungan <= 0 || nilaiBulan <= 0) {
        alert("Mohon masukkan nominal tabungan dan jumlah bulan dengan benar!");
    } else {
        // Jika data valid, jalankan perhitungan
        let totalAkhir = hitungTotal(nilaiTabungan, nilaiBulan);

        // Menampilkan hasil ke layar HTML
        teksHasil.innerText = "Rp " + totalAkhir.toLocaleString("id-ID");

        // Membuat objek data untuk riwayat
        let dataBaru = {
            tabungan: nilaiTabungan,
            bulan: nilaiBulan,
            total: totalAkhir
        };

        // Memasukkan objek ke dalam array riwayat menggunakan .push()
        riwayatArray.push(dataBaru);

        // Memperbarui tampilan daftar riwayat di HTML
        renderRiwayat();
    }
});

// Fungsi untuk merender/menampilkan array ke elemen HTML <ul>
function renderRiwayat() {
    daftarRiwayat.innerHTML = "";

    for (let i = 0; i < riwayatArray.length; i++) {
        let item = riwayatArray[i];
        
        let li = document.createElement("li");
        li.innerText = `Tabungan Rp ${item.tabungan.toLocaleString("id-ID")} x ${item.bulan} bulan = Rp ${item.total.toLocaleString("id-ID")}`;
        
        daftarRiwayat.appendChild(li);
    }
   
}

function tambahLayar(nilai) {
    const layar = document.getElementById("layarKalkulator");
    
    // 1. Ambil nilai layar, buang dulu semua titik (.) supaya jadi angka mentah asli
    let nilaiBersih = layar.value.replaceAll(".", "");
    
    // 2. Gabungkan dengan nilai yang baru ditekan
    let gabungan = nilaiBersih + nilai;

    // 3. Pisahkan bagian angka dan operator (+, -, *, /, %, ×, ÷) agar titik tidak salah tempat
    let bagian = gabungan.split(/([\+\-\*\/×÷%])/);

    // 4. Format bagian angkanya saja dengan titik ribuan (.toLocaleString)
    let hasilFormat = bagian.map(item => {
        if (!isNaN(item) && item !== "") {
            return Number(item).toLocaleString("id-ID");
        }
        return item; // Biarkan operator tetap seperti apa adanya
    }).join("");

    // 5. Tampilkan ke layar
    layar.value = hasilFormat;
}

// Fungsi tombol 'C' untuk mengosongkan layar kalkulator standar
function hapusLayar() {
    document.getElementById("layarKalkulator").value = "";
}

// Fungsi tombol '=' untuk menghitung string matematika
function hitungHasilStandar() {
    const layar = document.getElementById("layarKalkulator");
    try {
       if (layar.value === "") return;
       let nilaiLayar = layar.value;
       let rumus = layar.value.replaceAll("×", "*").replaceAll("÷", "/").replaceAll("%","/100");
       rumus = rumus.replaceAll(",", ".");
       let rumusFinal = nilaiLayar
           .replaceAll("×", "*")
           .replaceAll("÷", "/")
           .replaceAll("%", "/100")
           .replaceAll(",", "."); 
       let rumusAman = layar.value
           .replaceAll("×", "*")
           .replaceAll("÷", "/")
           .replaceAll("%", "/100")
           .replaceAll(".", "")
           .replaceAll(",", "."); 
      
        let hasil = eval(rumusAman);

        // 3. Tampilkan hasilnya
        if (isNaN(hasil) || !isFinite(hasil)) {
            layar.value = "Error";
        } else {
           // 4. Ubah angka hasil menjadi format titik ribuan (contoh: 1.000.000)           
          layar.value = hasil.toLocaleString("id-ID");
        }
    } catch (error) {
        layar.value = "Error";
    }
}
 let timerHapus;
let timeoutAwal;

// Fungsi dasar menghapus 1 karakter
function hapusSatuKarakter() {
    const layar = document.getElementById("layarKalkulator");
    layar.value = layar.value.slice(0, -1);
}

// Fungsi saat tombol DEL mulai ditekan / ditahan
function mulaiHapusCepat() {
    hapusSatuKarakter(); // Menghapus 1 karakter pertama seketika saat disentuh/diklik
    
    // Memberikan jeda 400ms sebelum mode hapus cepat otomatis aktif
    // Jadi kalau cuma diklik sekali, tidak langsung kebablasan menghapus banyak
    timeoutAwal = setTimeout(function() {
        timerHapus = setInterval(function() {
            hapusSatuKarakter();
        }, 90); // Kecepatan hapus saat tombol terus ditahan
    }, 400); 
}

// Fungsi saat tombol DEL dilepas
function berhentiHapusCepat() {
    clearTimeout(timeoutAwal);
    clearInterval(timerHapus);
}
