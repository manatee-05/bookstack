Prompt Start

"Build a web based book inventory management system named Bookstack. The app must allow me to track which books are in specific physical locations without any loaning or checkout features.

Technical Requirements:

Docker: Provide a Dockerfile and docker-compose.yml to run the entire stack. The app must be accessible on open port 6003.

Database: Use a relational database to store books and their locations.

API Integration: When an ISBN is entered, the app must automatically fetch the cover image, author, genre, and full metadata from the Google Books API and Open Library API.

Image Handling: Save image URLs in the database and ensure a fallback placeholder is used if no cover art is found.

Core User Interface:

Dashboard: Show total book counts and a list of physical locations.

Location View: A screen for a specific shelf or room that lists all books assigned to it.

Entry Interface: A 'Scan/Add' mode where I first select a location, then enter ISBNs one after another. After each entry, the book should be added to that location's list and the metadata should be fetched in the background.

Search: A global search bar that filters books by title, author, or genre.

UI/UX Preferences:

Clean, modern, and mobile responsive design.

Use a dark/light mode toggle.

Visual indicators for when metadata is being fetched.

Please generate the file structure, the backend logic for ISBN lookups, the frontend interface, and the Docker configuration."

Prompt End
