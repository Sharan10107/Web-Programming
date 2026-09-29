# Interactive Product Information Website

A modern, responsive, and fully interactive **Product Information Website** designed to manage and display consumer electronics such as smartphones, laptops, tablets, and headphones. 

This project transforms traditional product data into a dynamic web dashboard. Built using pure client-side web technologies, it provides real-time search, multi-criteria filtering, sorting, product details view, full CRUD (Create, Read, Update, Delete) functionality, favorites tracking, pagination, dark/light theme switching, and local storage data persistence without requiring any backend server or external database.

---

## 🚀 Features

* **Product Information Display**: Clean, structured layout with support for both modern tabular data and visual card grid views.
* **Responsive Design**: Fluid and adaptive interface designed for desktop, laptop, tablet, and mobile screens.
* **Product Search**: Instant, real-time search bar that filters dynamically across Product ID, Name, Brand, Category, Availability, and Price.
* **Category Filtering**: Dropdown filter to view products by category (*Smartphone, Laptop, Headphones, Tablet, Smartwatch, Gaming, Accessories*).
* **Brand Filtering**: Dropdown filter to isolate products by brand (*Apple, Samsung, Dell, Sony, ASUS, Bose, Google, Lenovo, OnePlus, Logitech*).
* **Product Sorting**: Sort products dynamically by Price (Low to High / High to Low), Rating (High to Low), and Product Name (A-Z / Z-A).
* **Product Details**: Interactive modal displaying complete product specifications, availability badge, formatted Indian currency price, and visual star ratings.
* **Add Product**: Modal form with field validation (unique ID, positive pricing, rating range) to add new products to the catalog with instant UI and counter updates.
* **Edit Product**: Edit existing product details with pre-filled modal forms and real-time updates.
* **Delete Product**: Safe deletion with a custom confirmation dialog to prevent accidental removal.
* **Favorite Products**: One-click heart/favorite toggle on all products with persistent storage and a dedicated **Show Favorites** filter toggle with a live counter badge.
* **Product Rating Display**: Star rating visualization (★★★★★) calculated dynamically with half-star and empty-star rendering.
* **Availability Badges**: Color-coded status badges indicating inventory state (*In Stock* in green, *Available* in blue, *Out of Stock* in red).
* **Product Statistics**: Live dashboard summary cards calculating Total Products, Smartphones, Laptops, Headphones, and Average Rating in real time.
* **Pagination**: Automatic pagination control with Previous, Next, and direct page navigation for catalogs with more than 5 products.
* **LocalStorage Persistence**: Saves all additions, modifications, deletions, favorites, and theme preferences to browser storage so data remains across page refreshes.
* **Dark / Light Mode**: Professional theme switcher with smooth transition animations and saved user preference.
* **Reset Products**: Dedicated option to restore the default product catalog at any time.
* **Mobile-Friendly Interface**: Responsive tables with horizontal scrolling containers and flexible grid cards preventing screen overflow.

---

## 🛠️ Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **HTML5** | Semantic website structure, dialogs, and accessibility landmarks |
| **CSS3** | Custom styling, CSS variables, dark/light themes, animations, and responsive layout |
| **JavaScript** | Dynamic functionality, DOM manipulation, event handling, filtering, sorting, and state management |
| **LocalStorage** | Client-side persistence for product records, favorites, and theme state |

> **Note:** No backend server or external database is required. The entire application executes client-side within the browser.

---

## 📁 Project Structure

```text
Interactive-Product-Information/
│
├── index.html     # Main HTML document defining structure, dashboard layout, and modal dialogs
├── style.css      # CSS stylesheet containing design system tokens, themes, layout, and animations
├── script.js      # Vanilla JavaScript containing application state, CRUD logic, filters, and storage
├── README.md      # Project documentation and guide
└── .vscode/       # VS Code workspace settings and configuration
```

### File Details:
* **`index.html`**: Contains the semantic markup, header, summary statistics cards, search and filter controls, table and grid view containers, modal popups, and toast notification container.
* **`style.css`**: Defines CSS custom properties (variables) for light and dark themes, typography (`Plus Jakarta Sans` and `Outfit`), responsive flexbox/grid layouts, badges, and smooth modal transitions.
* **`script.js`**: Contains modular JavaScript functions for state initialization, LocalStorage synchronization, CRUD operations, Indian currency formatting, star ratings, pagination, and DOM event listeners.

---

## 💻 How to Run

1. **Clone or download** the repository to your local machine:
   ```bash
   git clone https://github.com/your-username/Interactive-Product-Information.git
   ```
2. **Open the project folder** in **Visual Studio Code**.
3. **Install the Live Server extension** in VS Code if not already installed (Extension ID: `ritwickdey.LiveServer`).
4. **Open `index.html`** in the editor.
5. **Right-click `index.html`** in the file explorer or editor window.
6. Select **Open with Live Server** (or click **Go Live** on the bottom status bar).
7. The website will automatically launch in your default web browser (typically at `http://127.0.0.1:5500/index.html`).

---

## 📸 Screenshots

Add screenshots of the website here.

---

## 🎯 Learning Outcomes

This project demonstrates practical competence in front-end web development fundamentals:

* **HTML Table & Layout Creation**: Designing semantic, accessible structures for complex dashboards and interactive modal dialogs.
* **CSS Styling & Modern Theming**: Implementing CSS custom properties (variables) for dark/light themes, custom component styling, and glassmorphism.
* **Responsive Web Design**: Utilizing CSS Grid, Flexbox, and media queries to ensure seamless viewing across mobile, tablet, and desktop viewports.
* **JavaScript DOM Manipulation**: Dynamically creating, updating, and removing DOM elements in response to user actions without page reloads.
* **Event Handling**: Applying modular event listeners and event delegation patterns for optimal performance.
* **Search and Filtering**: Writing efficient array filter, search query, and sorting algorithms.
* **Dynamic Data Rendering**: Rendering dynamic star rating visualizations, currency formats, and multi-page pagination.
* **LocalStorage API**: Serializing and deserializing JSON data to persist application state across browser sessions.
* **Basic CRUD Operations**: Implementing Create, Read, Update, and Delete operations purely in client-side JavaScript.

---

## 🔮 Future Improvements

Possible future enhancements for this project include:

* **Backend Integration**: Connecting to a RESTful API built with Node.js/Express, Python/Flask, or similar.
* **Database Integration**: Storing product data in a database such as MongoDB, PostgreSQL, or MySQL.
* **User Authentication**: Adding login and role-based access control (Admin vs. Customer).
* **Online Product API**: Fetching real-time product catalogs and pricing from external APIs.
* **Shopping Cart**: Adding an interactive shopping cart with checkout summary and order placement.
* **Product Images**: Adding image upload support and image gallery carousels for each product.
* **Product Comparison**: Implementing a side-by-side product comparison feature.

---

## 👤 Author

**Naga Sharan**
