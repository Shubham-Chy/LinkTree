# ⛩️ Monochrome Retro-Anime Link Hub

A minimalist, high-contrast Linktree alternative inspired by 90s anime aesthetics, Japanese typography, and manga panels. Features a background-focused layout, custom crosshair cursor, falling cherry blossoms, and a reactive music player.

## ✨ Features

- **Old-School Anime Aesthetic**: Clean black and white design with high-contrast elements.
- **Dynamic Music Player**: Auto-plays a playlist (after user interaction) with a real-time frequency visualizer.
- **Atmospheric Background**: Full-screen grayscale background with subtle scanline effects.
- **Interactive UI**: Custom crosshair cursor that reacts to links and interactive elements.
- **Cherry Blossom Particles**: Subtle falling blossoms for a "zen" atmosphere.
- **Security**: Disabled right-click and text selection to maintain the "app-like" experience.
- **Responsive**: Fully optimized for mobile and desktop browsers.

## 🛠️ Tech Stack

- **React 19**: Modern UI component architecture.
- **Tailwind CSS**: Rapid utility-first styling.
- **Web Audio API**: Real-time music visualization.
- **ESM.sh**: No-build setup using native browser modules.

## 🚀 Getting Started

Since this project uses a "no-build" setup (loading React via ESM modules), you don't need a complex build pipeline.

### Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   cd YOUR_REPO_NAME
   ```

2. **Run a local server**:
   You can use any local server to view the site. For example, using Python or Node:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node (npx)
   npx serve .
   ```

3. Open your browser to `http://localhost:8000`.

## ⚙️ Customization

### 1. Update Personal Info & Links
Open `constants.ts` and update the `CONFIG` object:
- `name`: Your full name (e.g., "SHUBHAM CHOUDHARY").
- `handle`: Your social handle (e.g., "@animeforensic").
- `bio`: Your short bio.
- `avatar`: URL to your background image.
- `links`: Add or remove link objects.

### 2. Add Music
1. Create a folder named `music` in the root directory.
2. Add your `.mp3` files (e.g., `track1.mp3`, `track2.mp3`).
3. Update the `playlist` array in `constants.ts` with the file paths and titles.
   *Note: Due to browser security, files must be manually listed in the config; the browser cannot automatically "scan" your folder.*

## 📦 Deployment to GitHub Pages

1. **Push your code** to a GitHub repository.
2. Go to your repository **Settings** on GitHub.
3. Click on **Pages** in the left sidebar.
4. Under **Build and deployment > Source**, select **Deploy from a branch**.
5. Select the `main` branch and the `/(root)` folder.
6. Click **Save**.
7. Your site will be live at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` in a few minutes!

## 📜 License
Personal Use Only. 

---
*Created by Shubham Choudhary.*
