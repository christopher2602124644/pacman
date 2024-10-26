const pacman = document.getElementById('pacman');
const dotsContainer = document.getElementById('gameArea');
let score = 0;
let level = 1;

// Set posisi awal Pac-Man
let pacmanX = 0;
let pacmanY = 0;

// Fungsi untuk menggerakkan hantu
function moveGhosts() {
    const ghosts = document.querySelectorAll('.ghost');
    ghosts.forEach((ghost) => {
        const direction = Math.floor(Math.random() * 4); // 0: atas, 1: bawah, 2: kiri, 3: kanan
        const ghostX = parseInt(ghost.style.left);
        const ghostY = parseInt(ghost.style.top);

        switch (direction) {
            case 0: // Gerak ke atas
                if (ghostY > 0) ghost.style.top = `${ghostY - 10}px`;
                break;
            case 1: // Gerak ke bawah
                if (ghostY < 370) ghost.style.top = `${ghostY + 10}px`;
                break;
            case 2: // Gerak ke kiri
                if (ghostX > 0) ghost.style.left = `${ghostX - 10}px`;
                break;
            case 3: // Gerak ke kanan
                if (ghostX < 370) ghost.style.left = `${ghostX + 10}px`;
                break;
        }

        // Cek tabrakan dengan penghalang
        const barriers = document.querySelectorAll('.barrier');
        barriers.forEach((barrier) => {
            if (checkCollisionWithElement(ghost, barrier)) {
                // Jika hantu bertabrakan dengan penghalang, kembalikan ke posisi sebelumnya
                switch (direction) {
                    case 0: ghost.style.top = `${ghostY + 10}px`; break; // Kembali ke bawah
                    case 1: ghost.style.top = `${ghostY - 10}px`; break; // Kembali ke atas
                    case 2: ghost.style.left = `${ghostX + 10}px`; break; // Kembali ke kanan
                    case 3: ghost.style.left = `${ghostX - 10}px`; break; // Kembali ke kiri
                }
            }
        });
    });
}

function startGhostMovement() {
    ghostInterval = setInterval(moveGhosts, 500);
}


// Panggil fungsi moveGhosts setiap 500ms
setInterval(moveGhosts, 500);

document.addEventListener('keydown', (event) => {
    const key = event.key;

    switch (key) {
        case 'ArrowUp':
            if (pacmanY > 0) {
                pacmanY -= 10;
                pacman.style.top = `${pacmanY}px`;
            }
            break;
        case 'ArrowDown':
            if (pacmanY < 370) {
                pacmanY += 10;
                pacman.style.top = `${pacmanY}px`;
            }
            break;
        case 'ArrowLeft':
            if (pacmanX > 0) {
                pacmanX -= 10;
                pacman.style.left = `${pacmanX}px`;
            }
            break;
        case 'ArrowRight':
            if (pacmanX < 370) {
                pacmanX += 10;
                pacman.style.left = `${pacmanX}px`;
            }
            break;
    }

    checkCollision();
});

function checkCollision() {
    const dots = document.querySelectorAll('.dot');
    const ghosts = document.querySelectorAll('.ghost');
    const barriers = document.querySelectorAll('.barrier');

    // Cek collision dengan titik
    dots.forEach((dot) => {
        if (checkCollisionWithElement(pacman, dot)) {
            score++;
            dot.remove(); // Menghilangkan titik yang dimakan
            pacman.classList.add('eating'); // Tambahkan kelas animasi
 setTimeout(() => pacman.classList.remove('eating'), 200); // Hapus kelas setelah animasi
            addNewDot(); // Menambahkan titik baru
        }
    });

    // Cek collision dengan musuh
    ghosts.forEach((ghost) => {
        if (checkCollisionWithElement(pacman, ghost)) {
            alert(`Game Over! Your score is ${score}`);
            location.reload();
        }
    });

    // Cek collision dengan blok penghalang
    barriers.forEach((barrier) => {
        if (checkCollisionWithElement(pacman, barrier)) {
            alert(`You hit a barrier!`);
            location.reload();
        }
    });

    // Cek level
    if (score >= level * 5) {
        level++;
        alert(`Level Up! You are now on level ${level}`);
        // Reset posisi Pac-Man
        pacmanX = 0;
        pacmanY = 0;
        pacman.style.top = `${pacmanY}px`;
        pacman.style.left = `${pacmanX}px`;
        // Tambahkan lebih banyak hantu di level yang lebih tinggi
        addMoreGhosts(level);
    }
}

function addNewDot() {
    const newDot = document.createElement('div');
    newDot.classList.add('dot');
    newDot.style.position = 'absolute';
    newDot.style.width = '10px';
    newDot.style.height = '10px';
    newDot.style.backgroundColor = 'yellow'; // Warna titik
    newDot.style.top = `${Math.floor(Math.random() * 390)}px`; // Menghindari keluar dari area
    newDot.style.left = `${Math.floor(Math.random() * 390)}px`; // Menghindari keluar dari area
    dotsContainer.appendChild(newDot);
}

function addMoreGhosts(level) {
    // Tambahkan hantu baru sesuai dengan level
    for (let i = 0; i < level; i++) {
        const newGhost = document.createElement('div');
        newGhost.classList.add('ghost');
        newGhost.style.position = 'absolute';
        newGhost.style.width = '20px';
        newGhost.style.height = '20px';
        newGhost.style.backgroundColor = 'red'; // Warna hantu
        newGhost.style.top = `${Math.floor(Math.random() * 390)}px`; // Menghindari keluar dari area
        newGhost.style.left = `${Math.floor(Math.random() * 390)}px`; // Menghindari keluar dari area
        dotsContainer.appendChild(newGhost);
    }
}

function addBarriers() {
    // Tambahkan blok penghalang
    for (let i = 0; i < 5; i++) {
        const newBarrier = document.createElement('div');
        newBarrier.classList.add('barrier');
        newBarrier.style.position = 'absolute';
        newBarrier.style.width = '20px';
        newBarrier.style.height = '20px';
        newBarrier.style.backgroundColor = 'blue'; // Warna blok penghalang
        newBarrier.style.top = `${Math.floor(Math.random() * 390)}px`; // Menghindari keluar dari area
        newBarrier.style.left = `${Math.floor(Math.random() * 390)}px`; // Menghindari keluar dari area
        dotsContainer.appendChild(newBarrier);
    }
}

addBarriers(); // Tambahkan blok penghalang

function checkCollisionWithElement(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();

    return !(rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom);
}