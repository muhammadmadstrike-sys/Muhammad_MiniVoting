// ============================================================================
// HSI BOARDING SCHOOL - MINI VOTING APP
// File: script.js
// ============================================================================

// 1. Inisialisasi Variable
let votes = [0, 0, 0, 0]; // Menyimpan jumlah vote kandidat [1, 2, 3, 4]
let candidates = [
  { id: 1, name: "Mini Game" },
  { id: 2, name: "Mini Store" },
  { id: 3, name: "To-Do App" },
  { id: 4, name: "Quiz App" }
];

let voteCount = 0; // Menghitung berapa kali user sudah memilih
const MAX_VOTE = 3; // Batas maksimal voting
let alertTimeout = null;

// 2. Ambil Elemen DOM
const totalVotesEl = document.getElementById("totalVotes");
const winnerTextEl = document.getElementById("winnerText");
const feedbackMessageEl = document.getElementById("feedbackMessage");
const btnReset = document.getElementById("btnReset");

// ============================================================================
// FUNCTION: Melakukan Voting (Maksimal 3x)
// ============================================================================
function castVote(candidateId, candidateName) {
  // Cek apakah user sudah mencapai batas maksimal 3 kali vote
  if (voteCount >= MAX_VOTE) {
    showFeedback(`⚠️ Kamu sudah mencapai batas maksimal ${MAX_VOTE}x vote!`);
    return;
  }

  // Tambahkan vote pada kandidat yang dipilih
  const index = candidateId - 1;
  votes[index]++;
  voteCount++; // Tambah jumlah hitungan vote user

  // Jika sudah mencapai 3x vote, kunci tombol voting
  if (voteCount >= MAX_VOTE) {
    disableVoteButtons();
  }

  // Tampilkan feedback sukses dengan sisa kuota vote
  const sisaVote = MAX_VOTE - voteCount;
  if (sisaVote > 0) {
    showFeedback(`✅ Vote ke-${voteCount} berhasil untuk ${candidateName}! (Sisa kuota: ${sisaVote}x) 🎉`);
  } else {
    showFeedback(`✅ Vote ke-3 berhasil untuk ${candidateName}! Kuota vote kamu sudah habis. 🎉`);
  }

  // Update tampilan UI
  updateUI();
}

// ============================================================================
// FUNCTION: Update Tampilan DOM
// ============================================================================
function updateUI() {
  // 1. Hitung Total Votes
  let total = 0;
  for (let i = 0; i < votes.length; i++) {
    total += votes[i];
  }
  totalVotesEl.textContent = total;

  // 2. Update Informasi Setiap Kandidat (Votes, Persentase, Progress Bar)
  for (let i = 0; i < votes.length; i++) {
    const candidateVotes = votes[i];
    const candidateId = i + 1;

    // Hitung Persentase
    let percentage = 0;
    if (total > 0) {
      percentage = Math.round((candidateVotes / total) * 100);
    }

    // Render ke DOM
    document.getElementById(`votes-${candidateId}`).textContent = candidateVotes;
    document.getElementById(`percent-${candidateId}`).textContent = `${percentage}%`;
    document.getElementById(`progress-${candidateId}`).style.width = `${percentage}%`;
  }

  // 3. Update Pemenang Sementara (Current Winner)
  updateWinner(total);
}

// ============================================================================
// FUNCTION: Menentukan Pemimpin / Current Winner
// ============================================================================
function updateWinner(total) {
  if (total === 0) {
    winnerTextEl.textContent = "Belum ada vote yang masuk";
    return;
  }

  let maxVotes = -1;
  let leaderName = "";
  let isTie = false;

  for (let i = 0; i < votes.length; i++) {
    if (votes[i] > maxVotes) {
      maxVotes = votes[i];
      leaderName = candidates[i].name;
      isTie = false;
    } else if (votes[i] === maxVotes && maxVotes > 0) {
      isTie = true;
    }
  }

  if (isTie) {
    winnerTextEl.textContent = `🤝 Seri! (${maxVotes} Votes)`;
  } else {
    winnerTextEl.textContent = `🥇 ${leaderName} (${maxVotes} Votes)`;
  }
}

// ============================================================================
// FUNCTION: Nonaktifkan & Aktifkan Tombol Vote
// ============================================================================
function disableVoteButtons() {
  for (let i = 1; i <= candidates.length; i++) {
    const btn = document.getElementById(`btn-vote-${i}`);
    btn.disabled = true;
    btn.textContent = "KUOTA HABIS";
  }
}

function enableVoteButtons() {
  for (let i = 1; i <= candidates.length; i++) {
    const btn = document.getElementById(`btn-vote-${i}`);
    btn.disabled = false;
    btn.textContent = "🗳️ VOTE";
  }
}

// ============================================================================
// FUNCTION: Feedback Notification
// ============================================================================
function showFeedback(message) {
  if (alertTimeout) clearTimeout(alertTimeout);

  feedbackMessageEl.textContent = message;
  feedbackMessageEl.classList.remove("hidden");

  alertTimeout = setTimeout(() => {
    feedbackMessageEl.classList.add("hidden");
  }, 3500);
}

// ============================================================================
// FUNCTION: Reset Voting
// ============================================================================
btnReset.addEventListener("click", function () {
  // Reset Variabel
  votes = [0, 0, 0, 0];
  voteCount = 0; // Reset hitungan vote user kembali ke 0

  // Aktifkan kembali tombol
  enableVoteButtons();

  // Update UI & Beri Pesan
  updateUI();
  showFeedback("🔄 Voting telah di-reset!");
});

// Initialize Program
updateUI();