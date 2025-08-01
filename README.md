# 🎵 Vinyl Tracker

A modern Next.js application to manage your vinyl record want list and collection. Track what you want, what you have, and discover new music with integrated album artwork and streaming links.

## ✨ Features

### 🎨 **Modern Interface**
- **Dark/Light Mode** with automatic system preference detection
- **Card & List Views** for flexible browsing
- **Responsive Design** that works on all devices
- **Smooth Animations** and intuitive interactions

### 📀 **Collection Management**
- **Import vinyl lists** from RTF/text files
- **Track status** - Mark albums as "Want" or "Have"
- **Search & Filter** by artist, album, genre, or label
- **Smart Sorting** by artist, album title, or release year

### 🎶 **Music Integration**
- **Automatic metadata lookup** via MusicBrainz API
- **Album artwork** from Cover Art Archive
- **Streaming links** to Apple Music and AllMusic
- **Discogs integration** for vinyl marketplace links

### 💾 **Data Management**
- **PostgreSQL database** with Prisma ORM
- **RESTful API** for all operations
- **Batch enrichment** for adding missing metadata
- **Persistent preferences** for theme and view settings

## 🚀 Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with dark mode support
- **Database**: PostgreSQL with Prisma ORM
- **Icons**: Lucide React
- **File Upload**: React Dropzone
- **APIs**: MusicBrainz, Cover Art Archive, Discogs

## 📱 Screenshots

### Light Mode - Card View
![Card View Light](docs/screenshots/card-light.png)

### Dark Mode - List View
![List View Dark](docs/screenshots/list-dark.png)

## 🛠️ Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/azum2025/vinyl-tracker.git
   cd vinyl-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**
   ```bash
   # Create a new database called 'vinyl_tracker'
   createdb vinyl_tracker
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   DATABASE_URL="postgresql://username@localhost:5432/vinyl_tracker?schema=public"
   DISCOGS_API_TOKEN=your_discogs_token_here  # Optional but recommended
   ```

5. **Run database migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
vinyl-tracker/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── api/              # Next.js API routes
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/           # React components
│   ├── contexts/             # React contexts (Theme, View)
│   └── lib/                  # Utility functions and API clients
├── public/                   # Static assets
└── docs/                     # Documentation
```

## 🔧 API Endpoints

- `GET /api/albums` - Get all albums
- `POST /api/albums` - Create a new album
- `GET /api/albums/[id]` - Get specific album
- `PATCH /api/albums/[id]` - Update album
- `DELETE /api/albums/[id]` - Delete album
- `POST /api/import` - Import albums from file
- `POST /api/enrich` - Enrich existing albums with metadata

## 📝 Usage

### Importing Your Collection

1. **Prepare your list** in a text file with format:
   ```
   - [ ] Artist Name - Album Title
   - [x] Artist Name - Album Title (for albums you have)
   ```

2. **Upload the file** using the import button
3. **Wait for processing** - the app will automatically fetch album art and metadata
4. **Use "Add Album Art & Links"** to enrich existing albums

### Managing Your Collection

- **Toggle status** by clicking the heart (want) or checkmark (have) icons
- **Search** using the search bar to find specific albums
- **Filter** by status using the tabs (All, Want List, Collection)
- **Sort** by clicking the sort buttons (Artist, Album, Year)
- **Switch views** between card and list layouts

## 🎯 Roadmap

- [ ] Export functionality (CSV, JSON)
- [ ] Album reviews and ratings
- [ ] Spotify integration
- [ ] Price tracking from Discogs
- [ ] Wishlist sharing
- [ ] Mobile app with React Native
- [ ] Vinyl condition tracking
- [ ] Purchase history

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [MusicBrainz](https://musicbrainz.org/) for music metadata
- [Cover Art Archive](https://coverartarchive.org/) for album artwork
- [Discogs](https://discogs.com/) for vinyl marketplace integration
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Lucide](https://lucide.dev/) for beautiful icons

## 📞 Support

If you have any questions or run into issues, please [open an issue](https://github.com/azum2025/vinyl-tracker/issues) on GitHub.

---

Made with ❤️ by [azum2025](https://github.com/azum2025)