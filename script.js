document.addEventListener('DOMContentLoaded', () => {
    const homeScreen = document.getElementById('home');
    const gameScreen = document.getElementById('game');
    const puzzleBoard = document.getElementById('puzzle-board');
    const backBtn = document.getElementById('back-btn');
    const restartBtn = document.getElementById('restart-btn');
    const timerDisplay = document.getElementById('timer');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const clickSound = document.getElementById('click-sound');
    const winSound = document.getElementById('win-sound');
    const winOverlay = document.getElementById('win-overlay');
    const winTime = document.getElementById('win-time');
    const winBackBtn = document.getElementById('win-back-btn');
    const winRestartBtn = document.getElementById('win-restart-btn');
    const puzzleButtons = document.querySelectorAll('.puzzle-btn');

    let selectedPiece = null;
    let puzzleImage = '';
    const puzzleSize = 4; // 4x4 grid
    let pieces = [];
    let timerInterval = null;
    let startTime = null;
    let isTimerStarted = false;
    let isMusicPlaying = true;

    // Müzik kontrolü
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggle.src = 'off.png';
        } else {
            backgroundMusic.play();
            musicToggle.src = 'on.png';
        }
        isMusicPlaying = !isMusicPlaying;
    });

    // Ana sayfaya dön (tamamlama ekranından)
    winBackBtn.addEventListener('click', () => {
        winOverlay.classList.add('hidden');
        gameScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        puzzleBoard.innerHTML = '';
        stopTimer();
        backgroundMusic.pause();
        isMusicPlaying = true;
        musicToggle.src = 'on.png';
    });

    // Tekrar oyna (tamamlama ekranından)
    winRestartBtn.addEventListener('click', () => {
        winOverlay.classList.add('hidden');
        startPuzzle();
    });

    // Puzzle seçimi
    puzzleButtons.forEach(button => {
        button.addEventListener('click', () => {
            puzzleImage = `img${button.dataset.puzzle}.png`;
            startPuzzle();
        });
    });

    // Ana sayfaya dön (oyun ekranından)
    backBtn.addEventListener('click', () => {
        gameScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
        puzzleBoard.innerHTML = '';
        stopTimer();
        backgroundMusic.pause();
        isMusicPlaying = true;
        musicToggle.src = 'on.png';
    });

    // Puzzle'ı yeniden başlat
    restartBtn.addEventListener('click', () => {
        startPuzzle();
    });

    // Puzzle başlat
    function startPuzzle() {
        homeScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');
        winOverlay.classList.add('hidden');
        createPuzzleBoard();
        shufflePieces();
        resetTimer();
        isTimerStarted = false;
        if (isMusicPlaying) {
            backgroundMusic.play();
        }
const puzzlePreview = document.getElementById('puzzle-preview');
    puzzlePreview.src = puzzleImage; // Seçilen puzzle’ın önizlemesi
    }

    // Puzzle tahtasını oluştur
    function createPuzzleBoard() {
        puzzleBoard.innerHTML = '';
        pieces = [];
        for (let i = 0; i < puzzleSize * puzzleSize; i++) {
            const piece = document.createElement('div');
            piece.classList.add('puzzle-piece');
            piece.dataset.index = i;
            piece.style.backgroundImage = `url(${puzzleImage})`;
            piece.style.backgroundSize = `${puzzleSize * 200}px ${puzzleSize * 200}px`;
            const row = Math.floor(i / puzzleSize);
            const col = i % puzzleSize;
            piece.style.backgroundPosition = `-${col * 200}px -${row * 200}px`;
            piece.dataset.correctIndex = i.toString(); // Doğru indeksi sakla
            piece.addEventListener('click', () => handlePieceClick(piece));
            puzzleBoard.appendChild(piece);
            pieces.push(piece);
        }
    }

    // Kare tıklama işlemi
    function handlePieceClick(piece) {
        clickSound.play(); // Tıklama sesi
        if (!isTimerStarted) {
            startTimer();
            isTimerStarted = true;
        }
        if (!selectedPiece) {
            selectedPiece = piece;
            piece.classList.add('selected');
        } else {
            if (selectedPiece !== piece) {
                swapPieces(selectedPiece, piece);
            }
            selectedPiece.classList.remove('selected');
            selectedPiece = null;
        }
    }

    // Kareleri yer değiştir
    function swapPieces(piece1, piece2) {
        const tempPos = piece1.style.backgroundPosition;
        piece1.style.backgroundPosition = piece2.style.backgroundPosition;
        piece2.style.backgroundPosition = tempPos;

        const tempIndex = piece1.dataset.index;
        piece1.dataset.index = piece2.dataset.index;
        piece2.dataset.index = tempIndex;

        // Animasyon için geçici ölçek efekti
        piece1.classList.add('selected');
        piece2.classList.add('selected');
        setTimeout(() => {
            piece1.classList.remove('selected');
            piece2.classList.remove('selected');
        }, 300);

        checkWin();
    }

    // Kareleri karıştır
    function shufflePieces() {
        for (let i = pieces.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            swapPieces(pieces[i], pieces[j]);
        }
    }

    // Kazanma kontrolü
    function checkWin() {
        const isWin = pieces.every(piece => {
            return piece.dataset.index === piece.dataset.correctIndex;
        });

        if (isWin) {
            stopTimer();
            backgroundMusic.pause();
            winSound.play();
            isMusicPlaying = true;
            musicToggle.src = 'on.png';
            winOverlay.classList.remove('hidden');
            confetti({
                particleCount: 150,
                spread: 80,
                colors: ['#ff0', '#0f0', '#00f', '#f00', '#ff69b4'],
                duration: 2000,
            });
        }
    }

    // Kronometre başlat
    function startTimer() {
        startTime = Date.now();
        timerInterval = setInterval(updateTimer, 10);
    }

    // Kronometre durdur
    function stopTimer() {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    // Kronometre sıfırla
    function resetTimer() {
        stopTimer();
        timerDisplay.textContent = '00:00:00';
    }

    // Kronometre güncelle
    function updateTimer() {
        const elapsed = Date.now() - startTime;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        const centiseconds = Math.floor((elapsed % 1000) / 10);
        const timeString = `${pad(minutes)}:${pad(seconds)}:${pad(centiseconds)}`;
        timerDisplay.textContent = timeString;
        winTime.textContent = `Süre: ${timeString}`; // Tamamlama ekranı için süre
    }

    // Sayıları iki haneli yap
    function pad(number) {
        return number.toString().padStart(2, '0');
    }
});