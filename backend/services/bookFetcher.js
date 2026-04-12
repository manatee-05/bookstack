const axios = require('axios');
const db = require('../db');

const FALLBACK_IMAGE = 'https://via.placeholder.com/128x192.png?text=No+Cover';

async function fetchMetadata(isbn) {
  try {
    let title = 'Unknown Title';
    let author = 'Unknown Author';
    let genre = 'Unknown Genre';
    let coverUrl = FALLBACK_IMAGE;

    // Try Google Books API first
    try {
      const googleResponse = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`);
      if (googleResponse.data.items && googleResponse.data.items.length > 0) {
        const volumeInfo = googleResponse.data.items[0].volumeInfo;
        title = volumeInfo.title || title;
        author = volumeInfo.authors ? volumeInfo.authors.join(', ') : author;
        genre = volumeInfo.categories ? volumeInfo.categories.join(', ') : genre;
        if (volumeInfo.imageLinks) {
          coverUrl = volumeInfo.imageLinks.thumbnail || volumeInfo.imageLinks.smallThumbnail || coverUrl;
        }
      }
    } catch (googleError) {
      console.error(`Error fetching from Google Books for ISBN ${isbn}:`, googleError.message);
    }

    // Try Open Library if Google didn't have much or as an alternative
    // Open library cover: https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg
    if (coverUrl === FALLBACK_IMAGE) {
      coverUrl = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
      // OpenLibrary doesn't return metadata synchronously for covers easily,
      // but we can query their API if needed. Let's rely on google for metadata, and openlibrary for covers.
    }

    return { title, author, genre, coverUrl };
  } catch (error) {
    console.error(`Error in metadata fetcher for ISBN ${isbn}:`, error.message);
    return { title: 'Unknown', author: 'Unknown', genre: 'Unknown', coverUrl: FALLBACK_IMAGE };
  }
}

async function processBookMetadata(bookId, isbn) {
  try {
    console.log(`Starting metadata fetch for book ${bookId} (ISBN: ${isbn})`);
    const { title, author, genre, coverUrl } = await fetchMetadata(isbn);

    // Check if OpenLibrary cover is actually valid by making a HEAD request
    let finalCoverUrl = coverUrl;
    if (coverUrl.includes('covers.openlibrary.org')) {
        try {
            const headResponse = await axios.head(coverUrl);
            // Open library often returns a 1x1 transparent gif when no cover is found,
            // but we'll just check if it's a 200 ok for now.
             // Actually, a simpler way is to just use it. If it fails to load on frontend, we handle it there or just use the google one.
        } catch (e) {
             finalCoverUrl = FALLBACK_IMAGE;
        }
    }

    await db.query(
      `UPDATE books
       SET title = $1, author = $2, genre = $3, cover_image_url = $4, metadata_status = $5
       WHERE id = $6`,
      [title, author, genre, finalCoverUrl, 'completed', bookId]
    );
    console.log(`Successfully updated metadata for book ${bookId}`);
  } catch (error) {
    console.error(`Failed to process metadata for book ${bookId}:`, error);
    await db.query(
      `UPDATE books SET metadata_status = $1 WHERE id = $2`,
      ['failed', bookId]
    );
  }
}

module.exports = {
  processBookMetadata
};