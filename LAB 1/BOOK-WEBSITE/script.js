const books = {
    atomic: {
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self-Help",
        price: "499",
        rating: "4.8/5",
        cover: "images/atomic habits.jpg",
        description: "Atomic Habits explains how small changes in daily behavior can create remarkable results. The book provides practical strategies for building good habits and breaking bad ones."
    },

    alchemist: {
        title: "The Alchemist",
        author: "Paulo Coelho",
        category: "Fiction",
        price: "299",
        rating: "4.7/5",
        cover: "images/al chemist.jpg",
        description: "The Alchemist follows a young shepherd named Santiago who travels in search of a treasure and discovers important lessons about dreams, purpose and life."
    },

    richdad: {
        title: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        category: "Finance",
        price: "399",
        rating: "4.6/5",
        cover: "images/rich dad poor dad.jpg",
        description: "Rich Dad Poor Dad explains financial education, investing, assets and liabilities through the author's experiences with his two father figures."
    },

    "1984": {
        title: "1984",
        author: "George Orwell",
        category: "Dystopian Fiction",
        price: "350",
        rating: "4.7/5",
        cover: "images/1984 book.jpg",
        description: "1984 is a dystopian novel about a society controlled by an authoritarian government. It explores themes of surveillance, freedom, truth and individual thought."
    },

    ikigai: {
        title: "Ikigai",
        author: "Héctor García & Francesc Miralles",
        category: "Self-Help",
        price: "450",
        rating: "4.6/5",
        cover: "images/IKIGAI.jpg",
        description: "Ikigai explores the Japanese concept of finding purpose and meaning in everyday life, combining ideas about happiness, health, work and personal fulfillment."
    },

    wings: {
        title: "Wings of Fire",
        author: "A. P. J. Abdul Kalam",
        category: "Autobiography",
        price: "350",
        rating: "4.8/5",
        cover: "images/wings of fire.jpeg",
        description: "Wings of Fire is the autobiography of A. P. J. Abdul Kalam, describing his early life, education and journey to becoming an aerospace scientist and a major figure in India's scientific development."
    }
};

function openBook(bookId) {
    window.location.href = "book.html?book=" + encodeURIComponent(bookId);
}

const params = new URLSearchParams(window.location.search);
const bookId = params.get("book");

if (bookId && books[bookId]) {
    const book = books[bookId];

    document.title = book.title + " - Book Library";
    document.getElementById("bookTitle").textContent = book.title;
    document.getElementById("bookAuthor").textContent = book.author;
    document.getElementById("bookCategory").textContent = book.category;
    document.getElementById("bookPrice").textContent = book.price;
    document.getElementById("bookRating").textContent = book.rating;
    
    const coverElement = document.getElementById("bookCover");
    if (coverElement) {
        coverElement.innerHTML = `<img src="${book.cover}" alt="${book.title}">`;
    }
    
    document.getElementById("bookDescription").textContent = book.description;
}
