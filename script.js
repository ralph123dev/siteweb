document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialization
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // 2. Mobile Menu Logic
    const menuBtn = document.getElementById('menuBtn');
    const closeBtn = document.getElementById('closeMenu');
    const mobileMenu = document.getElementById('mobileMenu');
    const menuLinks = document.querySelectorAll('.menu-links a');

    const toggleMenu = () => mobileMenu.classList.toggle('active');

    menuBtn?.addEventListener('click', toggleMenu);
    closeBtn?.addEventListener('click', toggleMenu);
    menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

    // 3. Aviator Demo Simulation
    const multiplierEl = document.getElementById('multiplierText');
    const balanceEl = document.getElementById('demoBalance');
    const profitEl = document.getElementById('potentialProfit');
    const cashoutBtn = document.getElementById('cashoutBtn');
    const plane = document.getElementById('planeIcon');
    const planeContainer = document.getElementById('planeContainer');

    let currentMultiplier = 1.0;
    let currentBalance = 10000;
    const betAmount = 1000;
    let isFinished = false;
    let animationId = null;

    const runSimulation = () => {
        if (isFinished) return;

        // Multiplier growth logic (exponential feel)
        const speed = currentMultiplier < 10 ? 0.05 : currentMultiplier < 100 ? 0.5 : 2.5;
        currentMultiplier += speed * (Math.random() * 0.5 + 0.5);

        // Update Text
        multiplierEl.innerText = currentMultiplier.toFixed(2) + 'x';

        // Potential Profit
        const profit = Math.floor(betAmount * currentMultiplier);
        profitEl.innerText = profit.toLocaleString('fr-FR');

        // Plane position move
        const moveX = Math.min(60, 10 + (currentMultiplier / 400) * 50);
        const moveY = Math.min(80, 10 + (currentMultiplier / 400) * 70);
        planeContainer.style.left = `${moveX}%`;
        planeContainer.style.bottom = `${moveY}%`;

        // Stop at 400
        if (currentMultiplier >= 400) {
            multiplierEl.innerText = "400.00x";
            multiplierEl.style.color = "#00E676";
            cancelAnimationFrame(animationId);
            return;
        }

        animationId = requestAnimationFrame(runSimulation);
    };

    // Cashout Logic Simulation
    cashoutBtn?.addEventListener('click', () => {
        if (isFinished) return;

        isFinished = true;
        cancelAnimationFrame(animationId);

        const finalProfit = Math.floor(betAmount * currentMultiplier);
        currentBalance += finalProfit;

        // Visual effects for success
        multiplierEl.style.color = "#00E676";
        cashoutBtn.style.display = 'none';

        // Animate balance numbers
        let startBalance = currentBalance - finalProfit;
        const duration = 1000;
        const startTime = performance.now();

        const updateBalance = (now) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedVal = Math.floor(startBalance + (finalProfit * progress));
            balanceEl.innerText = easedVal.toLocaleString('fr-FR');

            if (progress < 1) requestAnimationFrame(updateBalance);
        };
        requestAnimationFrame(updateBalance);

        setTimeout(() => {
            alert(`Félicitations ! Vous avez gagné ${finalProfit.toLocaleString()} FCFA sur cette démo !`);
            // Reset maybe? 
            // location.reload();
        }, 1500);
    });

    // Start simulation when in view
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            runSimulation();
            observer.disconnect();
        }
    }, { threshold: 0.5 });

    const demoSection = document.getElementById('demo');
    if (demoSection) observer.observe(demoSection);

    // 4. Development Modal Logic
    const devModal = document.getElementById('devModal');
    const appStoreBtn = document.getElementById('appStoreBtn');
    const closeModal = document.getElementById('closeModal');
    const confirmBtn = document.getElementById('confirmBtn');

    const openModal = () => {
        devModal.classList.add('active');
    };

    const closeDevModal = () => {
        devModal.classList.remove('active');
    };

    appStoreBtn?.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });

    closeModal?.addEventListener('click', closeDevModal);
    confirmBtn?.addEventListener('click', closeDevModal);

    // Close modal when clicking outside
    devModal?.addEventListener('click', (e) => {
        if (e.target === devModal) {
            closeDevModal();
        }
    });

    // 5. Crystal Game Demo Logic
    const CRYSTAL_TYPES = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
    const BOARD_SIZE = 6;
    const MATCH_MIN = 3;
    
    let crystalBoard = [];
    let crystalScore = 0;
    let crystalBalance = 10000;
    let crystalCombo = 0;
    let gameRunning = false;
    let gameTime = 60;
    let gameTimer = null;
    let selectedCrystal = null;

    const crystalBoardEl = document.getElementById('crystalBoard');
    const crystalOverlay = document.getElementById('crystalOverlay');
    const playCrystalBtn = document.getElementById('playCrystalBtn');
    const restartCrystalBtn = document.getElementById('restartCrystalBtn');
    const scoreEl = document.getElementById('crystalScore');
    const balanceEl2 = document.getElementById('crystalBalance');
    const comboEl = document.getElementById('crystalCombo');
    const timeEl = document.getElementById('crystalTime');

    // Initialize crystal board with random crystals
    const initCrystalBoard = () => {
        crystalBoard = [];
        for (let i = 0; i < BOARD_SIZE; i++) {
            crystalBoard[i] = [];
            for (let j = 0; j < BOARD_SIZE; j++) {
                crystalBoard[i][j] = {
                    type: CRYSTAL_TYPES[Math.floor(Math.random() * CRYSTAL_TYPES.length)],
                    removed: false
                };
            }
        }
    };

    // Render the crystal board
    const renderCrystalBoard = () => {
        crystalBoardEl.innerHTML = '';
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                const crystal = crystalBoard[i][j];
                if (!crystal.removed) {
                    const el = document.createElement('div');
                    el.className = `crystal-item crystal-${crystal.type}`;
                    el.dataset.row = i;
                    el.dataset.col = j;
                    el.innerHTML = '✨';
                    el.addEventListener('click', () => handleCrystalClick(i, j, el));
                    crystalBoardEl.appendChild(el);
                }
            }
        }
    };

    // Handle crystal click
    const handleCrystalClick = (row, col, el) => {
        if (!gameRunning) return;

        if (selectedCrystal === null) {
            selectedCrystal = { row, col };
            el.classList.add('selected');
        } else {
            // Clear previous selection
            document.querySelectorAll('.crystal-item.selected').forEach(e => e.classList.remove('selected'));

            // Check if adjacent
            const rowDiff = Math.abs(selectedCrystal.row - row);
            const colDiff = Math.abs(selectedCrystal.col - col);

            if (rowDiff + colDiff === 1) {
                // Swap crystals
                [crystalBoard[selectedCrystal.row][selectedCrystal.col], crystalBoard[row][col]] = 
                [crystalBoard[row][col], crystalBoard[selectedCrystal.row][selectedCrystal.col]];
                
                selectedCrystal = null;
                checkMatches();
            } else {
                selectedCrystal = { row, col };
                el.classList.add('selected');
            }
        }
    };

    // Check for matching crystals
    const checkMatches = () => {
        let matches = [];
        
        // Check horizontal matches
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE - 2; j++) {
                const a = crystalBoard[i][j];
                const b = crystalBoard[i][j + 1];
                const c = crystalBoard[i][j + 2];
                
                if (!a.removed && !b.removed && !c.removed && 
                    a.type === b.type && b.type === c.type) {
                    matches.push([i, j], [i, j + 1], [i, j + 2]);
                }
            }
        }

        // Check vertical matches
        for (let j = 0; j < BOARD_SIZE; j++) {
            for (let i = 0; i < BOARD_SIZE - 2; i++) {
                const a = crystalBoard[i][j];
                const b = crystalBoard[i + 1][j];
                const c = crystalBoard[i + 2][j];
                
                if (!a.removed && !b.removed && !c.removed && 
                    a.type === b.type && b.type === c.type) {
                    matches.push([i, j], [i + 1, j], [i + 2, j]);
                }
            }
        }

        // Remove duplicates
        matches = [...new Set(matches.map(m => m.join(',')))].map(m => m.split(',').map(Number));

        if (matches.length > 0) {
            crystalCombo++;
            comboEl.classList.add('active');
            setTimeout(() => comboEl.classList.remove('active'), 300);
            
            const points = matches.length * 10 * crystalCombo;
            crystalScore += points;
            scoreEl.innerText = crystalScore;
            
            const gains = Math.floor(points / 10);
            crystalBalance += gains;
            balanceEl2.innerText = crystalBalance.toLocaleString('fr-FR');
            
            comboEl.innerText = `${crystalCombo}x`;

            // Animate removals
            matches.forEach(([i, j]) => {
                crystalBoard[i][j].removed = true;
            });

            // Remove from view and refill
            setTimeout(() => {
                refillBoard();
                renderCrystalBoard();
                checkMatches();
            }, 300);
        } else {
            crystalCombo = 0;
            comboEl.innerText = '0x';
            renderCrystalBoard();
        }
    };

    // Refill board after matches
    const refillBoard = () => {
        // Gravity - drop pieces
        for (let j = 0; j < BOARD_SIZE; j++) {
            let writePos = BOARD_SIZE - 1;
            for (let i = BOARD_SIZE - 1; i >= 0; i--) {
                if (!crystalBoard[i][j].removed) {
                    crystalBoard[writePos][j] = crystalBoard[i][j];
                    if (writePos !== i) {
                        crystalBoard[i][j].removed = true;
                    }
                    writePos--;
                }
            }
        }

        // Fill empty spaces with new crystals
        for (let i = 0; i < BOARD_SIZE; i++) {
            for (let j = 0; j < BOARD_SIZE; j++) {
                if (crystalBoard[i][j].removed) {
                    crystalBoard[i][j] = {
                        type: CRYSTAL_TYPES[Math.floor(Math.random() * CRYSTAL_TYPES.length)],
                        removed: false
                    };
                }
            }
        }
    };

    // Start crystal game
    const startCrystalGame = () => {
        if (gameRunning) return;
        
        gameRunning = true;
        gameTime = 60;
        crystalScore = 0;
        crystalCombo = 0;
        crystalBalance = 10000;
        selectedCrystal = null;

        scoreEl.innerText = '0';
        comboEl.innerText = '0x';
        balanceEl2.innerText = '10,000';
        timeEl.innerText = '60s';

        crystalOverlay.classList.add('hidden');

        initCrystalBoard();
        renderCrystalBoard();

        // Game timer
        gameTimer = setInterval(() => {
            gameTime--;
            timeEl.innerText = gameTime + 's';

            if (gameTime <= 0) {
                endCrystalGame();
            }
        }, 1000);
    };

    // End crystal game
    const endCrystalGame = () => {
        gameRunning = false;
        clearInterval(gameTimer);
        crystalOverlay.classList.remove('hidden');

        const finalGains = Math.floor(crystalScore / 10);
        alert(`Partie terminée ! Score: ${crystalScore}\nGains: ${finalGains.toLocaleString('fr-FR')} FCFA`);
    };

    // Event listeners
    playCrystalBtn?.addEventListener('click', startCrystalGame);
    restartCrystalBtn?.addEventListener('click', startCrystalGame);

    // Initialize on load
    initCrystalBoard();
    renderCrystalBoard();
});
