(function () {
    "use strict";

    /* 1. Dark Mode Toggle with LocalStorage */
    function initTheme() {
        const btn = document.getElementById("theme-toggle");
        const icon = document.getElementById("theme-icon");
        const label = document.getElementById("theme-label");
        const saved = localStorage.getItem("portfolio_theme");

        function apply(dark) {
            document.body.classList.toggle("dark-mode", dark);
            btn.setAttribute("aria-pressed", String(dark));
            icon.textContent = dark ? "☀️" : "🌙";
            label.textContent = dark ? "Light" : "Dark";
        }

        if (saved === "dark") apply(true);

        btn.addEventListener("click", () => {
            const isDark = !document.body.classList.contains("dark-mode");
            apply(isDark);
            localStorage.setItem("portfolio_theme", isDark ? "dark" : "light");
        });
    }

    /* 2. Mobile Menu Toggle */
    function initMobileNav() {
        const menuBtn = document.getElementById("mobile-menu-btn");
        const nav = document.getElementById("nav-links");
        if (!menuBtn || !nav) return;
        const links = nav.querySelectorAll("a");

        menuBtn.addEventListener("click", () => {
            const open = nav.classList.toggle("mobile-open");
            menuBtn.setAttribute("aria-expanded", String(open));
            menuBtn.textContent = open ? "Close ✕" : "Menu ☰";
        });

        links.forEach(l => l.addEventListener("click", () => {
            nav.classList.remove("mobile-open");
            menuBtn.setAttribute("aria-expanded", "false");
            menuBtn.textContent = "Menu ☰";
        }));
    }

    /* 3. Interactive Story Cards (Flip to Read Story) */
    function initStoryCards() {
        const readBtns = document.querySelectorAll(".read-story-btn");
        const backBtns = document.querySelectorAll(".story-back-btn");
        const ghBtns = document.querySelectorAll(".card-github-btn, .story-cta-live, .story-cta-repo");

        readBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const card = btn.closest(".story-card");
                if (card) {
                    card.classList.add("is-flipped");
                    btn.setAttribute("aria-expanded", "true");
                    const backBtn = card.querySelector(".story-back-btn");
                    if (backBtn) backBtn.focus();
                }
            });
        });

        backBtns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                const card = btn.closest(".story-card");
                if (card) {
                    card.classList.remove("is-flipped");
                    const readBtn = card.querySelector(".read-story-btn");
                    if (readBtn) {
                        readBtn.setAttribute("aria-expanded", "false");
                        readBtn.focus();
                    }
                }
            });
        });

        ghBtns.forEach(link => {
            link.addEventListener("click", (e) => {
                // Ensure external navigation doesn't trigger card flips
                e.stopPropagation();
            });
        });
    }

    /* 4. Project Category Filter & Showcase More Toggle */
    function initProjects() {
        const filterBtns = document.querySelectorAll(".filter-tab");
        const cards = document.querySelectorAll(".story-card-wrapper");
        const grid = document.getElementById("projects-grid");
        const moreBtn = document.getElementById("toggle-more-projects-btn");

        if (!grid || !cards.length) return;

        // Filter tabs logic
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const cat = btn.getAttribute("data-filter");

                if (cat === "all") {
                    grid.classList.remove("filter-active");
                    cards.forEach(card => card.classList.remove("hidden"));
                } else if (cat === "more") {
                    grid.classList.add("filter-active");
                    cards.forEach(card => {
                        const isExtra = card.classList.contains("story-card-extra");
                        card.classList.toggle("hidden", !isExtra);
                    });
                } else {
                    grid.classList.add("filter-active");
                    cards.forEach(card => {
                        const match = card.getAttribute("data-category") === cat;
                        card.classList.toggle("hidden", !match);
                    });
                }

                // If any cards are flipped when filtering, gently unflip them
                cards.forEach(c => {
                    const inner = c.querySelector(".story-card");
                    if (inner) inner.classList.remove("is-flipped");
                });
            });
        });

        // "Show More Projects" button
        if (moreBtn) {
            const btnText = moreBtn.querySelector(".btn-text");
            moreBtn.addEventListener("click", () => {
                const isExpanded = grid.classList.toggle("show-all");
                moreBtn.setAttribute("aria-expanded", String(isExpanded));
                if (btnText) {
                    btnText.textContent = isExpanded ? "Show Less" : "Show More Projects (3 more)";
                }

                // Ensure "All Stories" tab is active if user toggled expand
                const allTab = document.querySelector('.filter-tab[data-filter="all"]');
                if (allTab && !allTab.classList.contains("active")) {
                    filterBtns.forEach(b => b.classList.remove("active"));
                    allTab.classList.add("active");
                    grid.classList.remove("filter-active");
                    cards.forEach(card => card.classList.remove("hidden"));
                }
            });
        }
    }

    /* 5. Modal Case Study Dialog (Fallback Support) */
    function initModal() {
        const modal = document.getElementById("project-modal");
        const title = document.getElementById("modal-title");
        const tech = document.getElementById("modal-tech");
        const desc = document.getElementById("modal-desc");
        const closeBtn = document.getElementById("modal-close-btn");
        const okBtn = document.getElementById("modal-ok-btn");
        const openBtns = document.querySelectorAll(".open-modal-btn");
        if (!modal) return;
        let lastFocus = null;

        openBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                lastFocus = btn;
                title.textContent = btn.getAttribute("data-title");
                tech.textContent = "Tech: " + btn.getAttribute("data-tech");
                desc.textContent = btn.getAttribute("data-desc");
                modal.classList.add("open");
                modal.setAttribute("aria-hidden", "false");
                if (closeBtn) closeBtn.focus();
            });
        });

        function close() {
            modal.classList.remove("open");
            modal.setAttribute("aria-hidden", "true");
            if (lastFocus) lastFocus.focus();
        }

        if (closeBtn) closeBtn.addEventListener("click", close);
        if (okBtn) okBtn.addEventListener("click", close);
        modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
        document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("open")) close(); });
    }

    /* 6. Scroll Spy & Back-to-Top Button */
    function initScroll() {
        const topBtn = document.getElementById("back-to-top");
        const sections = document.querySelectorAll("main section[id]");
        const navLinks = document.querySelectorAll(".nav-link");

        window.addEventListener("scroll", () => {
            const top = window.scrollY || document.documentElement.scrollTop;
            if (topBtn) topBtn.classList.toggle("visible", top > 350);

            let activeId = "hero";
            sections.forEach(s => {
                if (top >= s.offsetTop - 120) activeId = s.getAttribute("id");
            });
            navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + activeId));
        }, { passive: true });

        if (topBtn) {
            topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
        }
    }

    /* 7. Copy Email Handler */
    function initCopy() {
        const btn = document.getElementById("copy-email-btn");
        if (!btn) return;
        const email = "marcellamarkus03@gmail.com";

        btn.addEventListener("click", async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const t = document.createElement("textarea");
                    t.value = email;
                    document.body.appendChild(t);
                    t.select();
                    document.execCommand("copy");
                    document.body.removeChild(t);
                }
                const orig = btn.textContent;
                btn.textContent = "✓ Copied to Clipboard";
                setTimeout(() => { btn.textContent = orig; }, 2200);
            } catch (err) {
                console.error("Copy failed", err);
            }
        });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initTheme();
        initMobileNav();
        initStoryCards();
        initProjects();
        initModal();
        initScroll();
        initCopy();
    });
})();
