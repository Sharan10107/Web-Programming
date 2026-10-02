document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".site-nav");

    if (menuButton && navigation) {
        const closeMenu = () => {
            menuButton.setAttribute("aria-expanded", "false");
            menuButton.setAttribute("aria-label", "Open navigation");
            navigation.classList.remove("is-open");
        };

        menuButton.addEventListener("click", () => {
            const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
            menuButton.setAttribute("aria-expanded", String(!isExpanded));
            menuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
            navigation.classList.toggle("is-open", !isExpanded);
        });

        navigation.addEventListener("click", (event) => {
            if (event.target.closest("a")) closeMenu();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") closeMenu();
        });
    }

    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".site-nav a").forEach((link) => {
        if (link.getAttribute("href") === currentPage) {
            link.setAttribute("aria-current", "page");
        }
    });

    document.querySelectorAll("[data-year]").forEach((year) => {
        year.textContent = String(new Date().getFullYear());
    });

    // Reveal content as it enters view, while leaving it visible if the API is unavailable.
    const revealItems = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealItems.forEach((item) => revealObserver.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add("is-visible"));
    }

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        const updateBackToTop = () => {
            backToTop.classList.toggle("is-visible", window.scrollY > 480);
        };
        window.addEventListener("scroll", updateBackToTop, { passive: true });
        updateBackToTop();
        backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    }

    const form = document.querySelector("#admissions-form");
    const formStatus = document.querySelector("#form-status");
    if (form && formStatus) {
        form.addEventListener("input", (event) => {
            if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
                event.target.setCustomValidity("");
            }
        });

        form.addEventListener("submit", (event) => {
            event.preventDefault();
            const name = form.elements.namedItem("name");
            const email = form.elements.namedItem("email");
            const phone = form.elements.namedItem("phone");
            const message = form.elements.namedItem("message");

            name.setCustomValidity(name.value.trim().length < 2 ? "Please enter at least two characters for your name." : "");
            email.setCustomValidity(email.value.trim() ? "" : "Please enter your email address.");
            phone.setCustomValidity(phone.value && !/^[+0-9() -]{7,20}$/.test(phone.value) ? "Please enter a valid phone number." : "");
            message.setCustomValidity(message.value.trim().length < 10 ? "Please add at least 10 characters so we can help you." : "");

            if (!form.reportValidity()) {
                formStatus.textContent = "Please check the highlighted fields and try again.";
                formStatus.classList.add("is-error");
                return;
            }

            formStatus.textContent = "Thank you. Your details are valid; this project demo does not send enquiries to a server.";
            formStatus.classList.remove("is-error");
        });
    }
});