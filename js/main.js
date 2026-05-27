/**
 * WEDDING WEB ENGINE SYSTEM V5 - FIX MAPS EMBED PRODUCTION
 */
document.addEventListener("DOMContentLoaded", () => {
    
    // UI ELEMENTS DOM
    const openingScreen = document.getElementById("opening-screen");
    const mainContent = document.getElementById("main-content");
    const btnOpenInvitation = document.getElementById("btn-open-invitation");
    const audio = document.getElementById("weddingMusic");
    const musicBtn = document.getElementById("music-control");
    const bottomNav = document.querySelector(".bottom-nav");
    
    const rsvpForm = document.getElementById("google-rsvp-form");
    const commentsContainer = document.getElementById("comments-container");
    const totalUcapanEl = document.getElementById("total-ucapan");
    const totalHadirEl = document.getElementById("total-hadir");

    // DATA BASE ENGINE SIMULATOR (Anti Ribet untuk HP)
    let databaseUcapan = [
        { nama: "Bapak Budi & Keluarga", kehadiran: "Hadir", datang: "Keluarga", ucapan: "Selamat menempuh hidup baru ya Vema dan Ambo! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Amin ya rabbal alamin." },
        { nama: "Sisca Kohl", kehadiran: "Hadir", datang: "Pasangan", ucapan: "Selamat ya Vema & Ambo Upe! Bahagia selalu selamanya sampai kakek nenek ✨" },
        { nama: "Aris Munandar", kehadiran: "Tidak Hadir", datang: "Sendiri", ucapan: "Selamat berbahagia kawan! Mohon maaf belum bisa hadir karena kendala jarak, doa terbaik dari jauh bro!" }
    ];

    if(localStorage.getItem("wedding_rsvp_data")) {
        databaseUcapan = JSON.parse(localStorage.getItem("wedding_rsvp_data"));
    } else {
        localStorage.setItem("wedding_rsvp_data", JSON.stringify(databaseUcapan));
    }

    const renderCommentBoard = () => {
        if (!commentsContainer) return;
        commentsContainer.innerHTML = "";
        
        let countHadir = 0;
        databaseUcapan.forEach(item => {
            if(item.kehadiran === "Hadir") {
                if(item.datang === "Pasangan") countHadir += 2;
                else if(item.datang === "Keluarga") countHadir += 4;
                else countHadir += 1;
            }

            const commentItem = document.createElement("div");
            commentItem.className = "comment-item";
            
            const badgeClass = item.kehadiran === "Hadir" ? "comment-badge" : "comment-badge absent";
            const companionText = item.kehadiran === "Hadir" ? `<div class="comment-companion">👥 Datang dengan: ${item.datang}</div>` : "";

            commentItem.innerHTML = `
                <div class="comment-meta">
                    <span class="comment-name">${escapeHtml(item.nama)}</span>
                    <span class="${badgeClass}">${item.kehadiran}</span>
                </div>
                <div class="comment-text">${escapeHtml(item.ucapan)}</div>
                ${companionText}
            `;
            commentsContainer.appendChild(commentItem);
        });

        if(totalUcapanEl) totalUcapanEl.textContent = databaseUcapan.length;
        if(totalHadirEl) totalHadirEl.textContent = countHadir;
    };

    const escapeHtml = (text) => {
        const map = { '&': '&', '<': '<', '>': '>', '"': '"', "'": ''' };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    };

    if(rsvpForm) {
        rsvpForm.addEventListener("submit", (e) => {
            e.preventDefault();
            
            const nama = document.getElementById("nama-input").value.trim();
            const kehadiran = document.getElementById("kehadiran-select").value;
            const datang = document.getElementById("datang-select").value;
            const ucapan = document.getElementById("ucapan-textarea").value.trim();

            if(!nama || !kehadiran || !ucapan) return;

            databaseUcapan.unshift({ nama, kehadiran, datang, ucapan });
            localStorage.setItem("wedding_rsvp_data", JSON.stringify(databaseUcapan));
            
            renderCommentBoard();
            rsvpForm.reset();
            alert("Terima kasih! Konfirmasi kehadiran & ucapan Anda berhasil disimpan.");
        });
    }

    setTimeout(() => {
        if(document.querySelectorAll(".opening-content .reveal-up")) {
            document.querySelectorAll(".opening-content .reveal-up").forEach(el => {
                el.classList.add("active");
            });
        }
    }, 150);

    if(btnOpenInvitation) {
        btnOpenInvitation.addEventListener("click", () => {
            openingScreen.classList.add("fade-out");
            mainContent.classList.remove("h-hide");
            
            audio.volume = 0.4;
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    musicBtn.classList.remove("paused");
                }).catch(() => {
                    musicBtn.classList.add("paused");
                });
            }
            
            setTimeout(() => {
                openingScreen.style.display = "none";
                musicBtn.classList.remove("hidden");
                bottomNav.classList.remove("hidden");
                
                initScrollReveal();
                initEngineFX();
                renderCommentBoard();
            }, 1100);
        });
    }

    if(musicBtn) {
        musicBtn.addEventListener("click", () => {
            if (audio.paused) {
                audio.play();
                musicBtn.classList.remove("paused");
                musicBtn.querySelector(".music-icon").textContent = "♫";
            } else {
                audio.pause();
                musicBtn.classList.add("paused");
                musicBtn.querySelector(".music-icon").textContent = "♩";
            }
        });
    }

    const targetDate = new Date("Jun 15, 2026 10:00:00").getTime();
    const runCountdown = () => {
        const now = new Date().getTime();
        const diff = targetDate - now;
        const countdownEl = document.getElementById("countdown");
        if (!countdownEl) return;
        
        if (diff < 0) {
            countdownEl.innerHTML = "<p style='color:var(--gold)'>Acara Berlangsung</p>";
            return;
        }
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        const daysEl = document.getElementById("days");
        const hoursEl = document.getElementById("hours");
        const minutesEl = document.getElementById("minutes");
        const secondsEl = document.getElementById("seconds");
        
        if(daysEl) daysEl.textContent = String(d).padStart(2, '0');
        if(hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
        if(minutesEl) minutesEl.textContent = String(m).padStart(2, '0');
        if(secondsEl) secondsEl.textContent = String(s).padStart(2, '0');
    };
    setInterval(runCountdown, 1000);
    runCountdown();

    const initScrollReveal = () => {
        const revealElements = document.querySelectorAll(".scroll-reveal");
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        revealElements.forEach(el => observer.observe(el));
    };

    const sections = document.querySelectorAll("section[id]");
    const navItems = document.querySelectorAll(".bottom-nav .nav-item");
    window.addEventListener("scroll", () => {
        let current = "";
        const pos = window.scrollY + 180;
        sections.forEach(s => {
            if (pos >= s.offsetTop && pos < s.offsetTop + s.offsetHeight) {
                current = s.getAttribute("id");
            }
        });
        navItems.forEach(item => {
            item.classList.remove("active");
            if (item.getAttribute("data-section") === current) item.classList.add("active");
        });
    });

    const initEngineFX = () => {
        const sCanvas = document.getElementById("sparkleCanvas");
        const pCanvas = document.getElementById("petalCanvas");
        if (!sCanvas || !pCanvas) return;
        
        const ctxS = sCanvas.getContext("2d");
        const ctxP = pCanvas.getContext("2d");
        let w = window.innerWidth, h = window.innerHeight;
        
        const resize = () => {
            w = window.innerWidth; h = window.innerHeight;
            sCanvas.width = w; sCanvas.height = h;
            pCanvas.width = w; pCanvas.height = h;
        };
        window.addEventListener("resize", resize);
        resize();

        const sparkles = [], petals = [];
        for(let i=0; i<18; i++) sparkles.push({
            x: Math.random()*w, y: Math.random()*h, s: Math.random()*2+1, a: Math.random()*0.5, sp: Math.random()*0.2+0.05, g: true
        });
        for(let i=0; i<12; i++) petals.push({
            x: Math.random()*w, y: -10, s: Math.random()*6+5, sy: Math.random()*1+0.5, sx: Math.random()*0.6-0.3, r: Math.random()*360, rs: Math.random()*0.8-0.4, c: ['#E3A7B6','#F0CCD4','#BA6B80'][Math.floor(Math.random()*3)]
        });

        const loop = () => {
            ctxS.clearRect(0,0,w,h); ctxP.clearRect(0,0,w,h);
            
            sparkles.forEach(p => {
                if (p.g) { p.a += 0.008; if(p.a >= 0.7) p.g = false; }
                else { p.a -= 0.005; if(p.a <= 0.05) { p.x = Math.random()*w; p.y = Math.random()*h; p.g = true; } }
                p.y -= p.sp; if(p.y < 0) p.y = h;
                ctxS.fillStyle = `rgba(243, 229, 171, ${p.a})`;
                ctxS.beginPath(); ctxS.arc(p.x, p.y, p.s, 0, Math.PI*2); ctxS.fill();
            });

            petals.forEach(p => {
                p.y += p.sy; p.x += p.sx + Math.sin(p.y/25)*0.2; p.r += p.rs;
                if(p.y > h+10 || p.x < -10 || p.x > w+10) { p.y = -10; p.x = Math.random()*w; }
                ctxP.save(); ctxP.translate(p.x, p.y); ctxP.rotate(p.r*Math.PI/180);
                ctxP.fillStyle = p.c; ctxP.globalAlpha = 0.5; ctxP.beginPath();
                ctxP.ellipse(0,0, p.s, p.s/1.6, 0, 0, Math.PI*2); ctxP.fill(); ctxP.restore();
            });
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    };
});

window.copyCardNumber = () => {
    const numText = "808101012496530"; 
    navigator.clipboard.writeText(numText).then(() => {
        const toast = document.getElementById("copy-toast");
        if(toast) {
            toast.style.display = "block";
            setTimeout(() => { toast.style.display = "none"; }, 2000);
        }
    }).catch(err => {
        console.error("Gagal menyalin text: ", err);
    });
};