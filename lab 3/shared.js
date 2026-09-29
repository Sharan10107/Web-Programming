/**
 * Book Information Website - Shared Interactivity & State Engine
 */

// Shared State & LocalStorage Manager
const AppState = {
    getKey(bookId) {
        return `book_app_${bookId}`;
    },

    getBookData(bookId) {
        try {
            const raw = localStorage.getItem(this.getKey(bookId));
            return raw ? JSON.parse(raw) : {
                rating: 0,
                status: 'unread', // 'unread', 'reading', 'completed'
                isFavorite: false,
                notes: '',
                progress: 0,
                checkedTakeaways: []
            };
        } catch (e) {
            return { rating: 0, status: 'unread', isFavorite: false, notes: '', progress: 0, checkedTakeaways: [] };
        }
    },

    saveBookData(bookId, data) {
        try {
            const current = this.getBookData(bookId);
            const updated = { ...current, ...data };
            localStorage.setItem(this.getKey(bookId), JSON.stringify(updated));
            // Trigger custom event for same-window updates
            window.dispatchEvent(new CustomEvent('bookStateChanged', { detail: { bookId, data: updated } }));
            // Notify parent/sibling frames if in frameset
            try {
                if (window.parent && window.parent.frames) {
                    for (let i = 0; i < window.parent.frames.length; i++) {
                        if (window.parent.frames[i] !== window && window.parent.frames[i].onExternalBookStateChange) {
                            window.parent.frames[i].onExternalBookStateChange(bookId, updated);
                        }
                    }
                }
            } catch (err) {}
            return updated;
        } catch (e) {
            console.error('Failed to save to localStorage', e);
        }
    },

    getGlobalStats() {
        const books = ['book1', 'book2', 'book3', 'book4'];
        let favorites = 0;
        let completed = 0;
        let reading = 0;
        let rated = 0;
        let totalNotes = 0;

        books.forEach(id => {
            const data = this.getBookData(id);
            if (data.isFavorite) favorites++;
            if (data.status === 'completed') completed++;
            if (data.status === 'reading') reading++;
            if (data.rating > 0) rated++;
            if (data.notes && data.notes.trim().length > 0) totalNotes++;
        });

        return { totalBooks: books.length, favorites, completed, reading, rated, totalNotes };
    }
};

// Theme Management
const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('book_app_theme') || 'light';
        this.setTheme(savedTheme, false);
    },

    setTheme(theme, save = true) {
        document.documentElement.setAttribute('data-theme', theme);
        if (save) {
            localStorage.setItem('book_app_theme', theme);
            // Notify other frames
            try {
                if (window.parent && window.parent.frames) {
                    for (let i = 0; i < window.parent.frames.length; i++) {
                        if (window.parent.frames[i] !== window && window.parent.frames[i].document) {
                            window.parent.frames[i].document.documentElement.setAttribute('data-theme', theme);
                        }
                    }
                }
            } catch (err) {}
        }
    },

    toggle() {
        const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next, true);
        showToast(next === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    }
};

// Toast Notifications System
function showToast(message, icon = '✨') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Copy to Clipboard Helper
function copyTextToClipboard(text, successMsg = 'Copied to clipboard!') {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(successMsg, '📋');
        }).catch(() => fallbackCopy(text, successMsg));
    } else {
        fallbackCopy(text, successMsg);
    }
}

function fallbackCopy(text, successMsg) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    try {
        document.execCommand('copy');
        showToast(successMsg, '📋');
    } catch (e) {
        showToast('Could not copy text', '⚠️');
    }
    document.body.removeChild(tempInput);
}

// Text-to-Speech (TTS) Narration Engine
class NarrationPlayer {
    constructor(getTextCallback) {
        this.getText = getTextCallback;
        this.synth = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.isPaused = false;
        this.pulseElem = document.getElementById('audio-pulse');
        this.playBtn = document.getElementById('btn-audio-play');
    }

    play() {
        if (!this.synth) {
            showToast('Text-to-speech is not supported in this browser.', '⚠️');
            return;
        }

        if (this.isPaused) {
            this.synth.resume();
            this.isPaused = false;
            this.isPlaying = true;
            this.updateUI();
            showToast('Resumed narration', '▶️');
            return;
        }

        this.synth.cancel(); // Stop any active speech
        const text = this.getText();
        if (!text) return;

        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = parseFloat(document.getElementById('audio-rate')?.value || 1.0);
        this.utterance.pitch = 1.0;

        this.utterance.onstart = () => {
            this.isPlaying = true;
            this.isPaused = false;
            this.updateUI();
            showToast('Reading aloud...', '🔊');
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateUI();
            showToast('Finished narration', '✅');
        };

        this.utterance.onerror = () => {
            this.isPlaying = false;
            this.isPaused = false;
            this.updateUI();
        };

        this.synth.speak(this.utterance);
    }

    pause() {
        if (this.synth && this.isPlaying && !this.isPaused) {
            this.synth.pause();
            this.isPaused = true;
            this.isPlaying = false;
            this.updateUI();
            showToast('Narration paused', '⏸️');
        }
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
            this.isPlaying = false;
            this.isPaused = false;
            this.updateUI();
            showToast('Narration stopped', '⏹️');
        }
    }

    updateUI() {
        if (this.pulseElem) {
            if (this.isPlaying) {
                this.pulseElem.classList.add('playing');
            } else {
                this.pulseElem.classList.remove('playing');
            }
        }
        if (this.playBtn) {
            this.playBtn.innerHTML = this.isPlaying ? '⏸️ Pause' : '▶️ Listen';
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
}

// Interactive Book Page Controller
function setupBookDetailPage(bookId, totalPages = 200) {
    ThemeManager.init();
    const data = AppState.getBookData(bookId);

    // 1. Reading Status Selector
    const statusSelect = document.getElementById('status-select');
    if (statusSelect) {
        statusSelect.value = data.status || 'unread';
        statusSelect.addEventListener('change', (e) => {
            const newStatus = e.target.value;
            AppState.saveBookData(bookId, { status: newStatus });
            const labels = { unread: 'Want to Read 📖', reading: 'Currently Reading ⏳', completed: 'Completed 🎉' };
            showToast(`Status updated: ${labels[newStatus]}`);
        });
    }

    // 2. Favorite Toggle Button
    const favBtn = document.getElementById('btn-favorite');
    if (favBtn) {
        if (data.isFavorite) favBtn.classList.add('active');
        favBtn.addEventListener('click', () => {
            const current = AppState.getBookData(bookId);
            const newFav = !current.isFavorite;
            AppState.saveBookData(bookId, { isFavorite: newFav });
            if (newFav) {
                favBtn.classList.add('active');
                favBtn.innerHTML = '💖 Favorited';
                showToast('Added to your Favorites! 💖');
            } else {
                favBtn.classList.remove('active');
                favBtn.innerHTML = '🤍 Favorite';
                showToast('Removed from Favorites');
            }
        });
        if (data.isFavorite) favBtn.innerHTML = '💖 Favorited';
    }

    // 3. Share / Copy Link Button
    const shareBtn = document.getElementById('btn-share');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const title = document.querySelector('h1')?.innerText || document.title;
            copyTextToClipboard(`Check out "${title}" on Book Information Website!`, 'Book details copied to clipboard!');
        });
    }

    // 4. Star Rating Widget
    const stars = document.querySelectorAll('.stars-container .star');
    const ratingText = document.getElementById('rating-text');
    
    function renderStars(rating) {
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
                star.innerText = '★';
            } else {
                star.classList.remove('active');
                star.innerText = '☆';
            }
        });
        if (ratingText) {
            ratingText.innerText = rating > 0 ? `Your Rating: ${rating} / 5 Stars` : 'Click a star to rate this book';
        }
    }

    renderStars(data.rating || 0);

    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            stars.forEach((s, i) => {
                s.innerText = i <= index ? '★' : '☆';
                if (i <= index) s.classList.add('hovered');
                else s.classList.remove('hovered');
            });
        });
        star.addEventListener('mouseleave', () => {
            const currentRating = AppState.getBookData(bookId).rating || 0;
            stars.forEach(s => s.classList.remove('hovered'));
            renderStars(currentRating);
        });
        star.addEventListener('click', () => {
            const newRating = index + 1;
            AppState.saveBookData(bookId, { rating: newRating });
            renderStars(newRating);
            showToast(`Rated ${newRating} out of 5 stars! ⭐`);
        });
    });

    // 5. Reading Progress Slider
    const progressSlider = document.getElementById('progress-slider');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');
    const pageText = document.getElementById('page-text');

    function updateProgressUI(percent) {
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.innerText = `${percent}% completed`;
        if (pageText) {
            const currentPage = Math.round((percent / 100) * totalPages);
            pageText.innerText = `Page ${currentPage} of ${totalPages}`;
        }
    }

    if (progressSlider) {
        progressSlider.value = data.progress || 0;
        updateProgressUI(data.progress || 0);
        progressSlider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            updateProgressUI(val);
        });
        progressSlider.addEventListener('change', (e) => {
            const val = parseInt(e.target.value);
            AppState.saveBookData(bookId, { progress: val });
            if (val === 100 && statusSelect) {
                statusSelect.value = 'completed';
                AppState.saveBookData(bookId, { status: 'completed' });
                showToast('Congratulations on completing this book! 🎉');
            } else if (val > 0 && statusSelect && statusSelect.value === 'unread') {
                statusSelect.value = 'reading';
                AppState.saveBookData(bookId, { status: 'reading' });
                showToast('Marked as Currently Reading 📖');
            }
        });
    }

    // 6. Interactive Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            const targetPane = document.getElementById(`tab-${target}`);
            if (targetPane) targetPane.classList.add('active');
        });
    });

    // 7. Interactive Takeaways Checklist
    const takeawayCheckboxes = document.querySelectorAll('.takeaway-checkbox');
    const checkedSaved = data.checkedTakeaways || [];
    takeawayCheckboxes.forEach((cb, idx) => {
        if (checkedSaved.includes(idx)) {
            cb.checked = true;
            cb.closest('.takeaway-item')?.classList.add('completed');
        }
        cb.addEventListener('change', () => {
            const item = cb.closest('.takeaway-item');
            if (cb.checked) {
                item?.classList.add('completed');
                showToast('Key takeaway checked! ✅');
            } else {
                item?.classList.remove('completed');
            }
            const activeChecked = [];
            takeawayCheckboxes.forEach((box, i) => {
                if (box.checked) activeChecked.push(i);
            });
            AppState.saveBookData(bookId, { checkedTakeaways: activeChecked });
        });
    });

    // 8. Personal Notes with Autosave
    const notesTextarea = document.getElementById('notes-textarea');
    const notesStatus = document.getElementById('notes-status');
    const clearNotesBtn = document.getElementById('btn-clear-notes');
    if (notesTextarea) {
        notesTextarea.value = data.notes || '';
        let timeout = null;
        notesTextarea.addEventListener('input', () => {
            if (notesStatus) notesStatus.innerText = 'Saving... ✍️';
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                AppState.saveBookData(bookId, { notes: notesTextarea.value });
                if (notesStatus) notesStatus.innerText = 'Autosaved just now ✅';
            }, 500);
        });
    }
    if (clearNotesBtn && notesTextarea) {
        clearNotesBtn.addEventListener('click', () => {
            if (notesTextarea.value.trim() && confirm('Are you sure you want to clear your notes for this book?')) {
                notesTextarea.value = '';
                AppState.saveBookData(bookId, { notes: '' });
                if (notesStatus) notesStatus.innerText = 'Notes cleared';
                showToast('Notes cleared');
            }
        });
    }

    // 9. Audio Player setup
    const player = new NarrationPlayer(() => {
        const descElem = document.getElementById('book-description');
        return descElem ? descElem.innerText : document.querySelector('.card')?.innerText || '';
    });
    const playBtn = document.getElementById('btn-audio-play');
    const stopBtn = document.getElementById('btn-audio-stop');
    if (playBtn) playBtn.addEventListener('click', () => player.toggle());
    if (stopBtn) stopBtn.addEventListener('click', () => player.stop());
}

// Window event listeners for cross-frame coordination
window.addEventListener('storage', (e) => {
    if (e.key === 'book_app_theme') {
        ThemeManager.setTheme(e.newValue, false);
    }
});
