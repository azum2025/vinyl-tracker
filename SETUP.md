# Vinyl Tracker Setup Instructions

Your Next.js vinyl tracking app has been successfully created! Here's how to get it running:

## Prerequisites

✅ Node.js (installed)
✅ PostgreSQL (installed and running)
✅ Database created

## Environment Setup

1. **Create your .env file** (copy the database URL that was set up):
   ```bash
   echo "DATABASE_URL=postgresql://$(whoami)@localhost:5432/vinyl_tracker?schema=public" > .env
   ```

2. **Get a Discogs API token** (optional but recommended):
   - Go to https://www.discogs.com/settings/developers
   - Create a new application
   - Get your personal access token
   - Add it to your .env file:
   ```bash
   echo "DISCOGS_API_TOKEN=your_token_here" >> .env
   ```

## Running the Application

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Open your browser** and go to: http://localhost:3000

## Using the App

### Importing Your Vinyl List

1. Click the upload area on the main page
2. Upload your RTF file (`Vinyl Want List 2025.rtf`)
3. The app will automatically:
   - Parse your list
   - Look up each album on Discogs
   - Fetch cover images, years, formats, etc.
   - Import everything into your database

### Managing Your Collection

- **Toggle Status**: Click the heart (want) or check (have) icon on each album
- **Search**: Use the search bar to find albums by artist, title, genre, or label
- **Filter**: Use the tabs to show all albums, just your want list, or just your collection
- **View Details**: Click the Discogs link to see more details about any album

## File Format

Your vinyl list should be in this format:
```
- [ ] Artist Name - Album Title
- [x] Another Artist - Another Album
```

Where:
- `- [ ]` = albums you want
- `- [x]` = albums you have

## Features

- ✅ RTF and TXT file import
- ✅ Automatic Discogs integration
- ✅ Cover image fetching
- ✅ Search and filtering
- ✅ Status management (want/have)
- ✅ PostgreSQL database storage
- ✅ Responsive design

## Troubleshooting

### Database Issues
If you get database connection errors:
```bash
# Make sure PostgreSQL is running
brew services start postgresql@15

# Recreate the database if needed
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"
dropdb vinyl_tracker
createdb vinyl_tracker
npx prisma migrate dev
```

### Discogs Rate Limiting
If imports are slow, the app includes automatic delays to respect Discogs API rate limits.

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **External API**: Discogs API for album metadata
- **File Upload**: react-dropzone
- **Icons**: Lucide React

Enjoy tracking your vinyl collection! 🎵