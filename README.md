# 🍴 UniBite – Affordable Campus Meal Ordering App

**UniBite** is a single-page web application designed for university students to easily explore and order affordable meals online.  
It combines **real meal data** from [TheMealDB API](https://www.themealdb.com/api.php) with **local backend simulation** using **JSON Server** and **Local Storage**, allowing users to browse meals, like their favorites, and simulate adding meals to a cart.

---

## 🎯 Project Overview

Many campus students struggle to find affordable meals online since most delivery apps are expensive.  
**UniBite** solves this by offering a simple, budget-friendly meal ordering platform built as a **Single Page Application (SPA)**.  

The app dynamically fetches meal data (name, image, ingredients, and details) from a public API, while likes and cart data are stored using a local JSON Server and browser Local Storage.

---

## 🧩 Technology Stack


- **HTML, CSS & Bootstrap 5** – structure and styling  
- **JavaScript (ES6)** – app logic and interactivity  
- **TheMealDB API** – fetches meal data (images, ingredients, instructions)  
- **JSON Server** – simulates a backend for likes/cart  
- **Local Storage** – stores data locally for persistence  


| Layer | Tool / Technology | Purpose |
|--------|------------------|----------|

| **Structure** | **HTML5** | Builds the foundation of the web page. |
| **Styling** | **CSS3 + Bootstrap 5** | Styles the app, ensures responsiveness, and adds layout components. |
| **Interactivity** | **JavaScript (ES6)** | Adds logic — fetches meals, handles clicks, updates UI dynamically. |
| **External API** | **TheMealDB API** | Provides real meal data (name, image, ingredients, preparation). |
| **Local Backend** | **JSON Server** | Simulates a backend to store likes, cart data, and user interactions. |
| **Browser Storage** | **Local Storage** | Stores cart or liked items temporarily on the user’s device. |
| **Version Control** | **Git + GitHub** | Tracks changes and hosts project code online. |
| **Editor** | **VS Code** | Development environment for building and testing the app. |

---

## 🧠 How It Works – Full Flow

### 1️⃣ **Frontend (HTML + CSS + Bootstrap)**
- `index.html` contains the layout — navbar, search bar, meal cards, cart, and liked meals section.  
- **Bootstrap 5** ensures a clean, mobile-responsive layout.  
- `style.css` adds custom colors, spacing, and fonts for UniBite’s unique look.

### 2️⃣ **Logic Layer (JavaScript)**
- `script.js` manages:
  - Fetching data from **TheMealDB API**
  - Rendering meal cards dynamically
  - Handling user clicks (likes, cart, search)
  - Communicating with **JSON Server** for backend simulation
  - Using **Local Storage** as a backup for saved data

### 3️⃣ **Real Meal Data (TheMealDB API)**
- Fetch meals 




## 🛠️ Setup
```bash
git clone https://github.com/<your-username>/unibite.git
cd unibite
npx json-server --watch db.json --port 3000

