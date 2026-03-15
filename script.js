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
});
