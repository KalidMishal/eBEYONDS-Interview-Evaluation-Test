# eBEYONDS Interview Evaluation Test

This repository contains the completed frontend and backend code for the eBEYONDS UI/UX & Backend Evaluation Test.

## Project Structure
- `frontend/` - Contains the HTML, CSS (responsive for Desktop, Tablet, and Mobile), JavaScript, and assets.
  - Features a custom dark theme matching the design specs.
  - Fully responsive grid layout.
  - Integrates with the TVMaze API to fetch TV shows and dynamically add them to a "Favorites" grid.
  - Uses an HTML5 WebM video for the responsive banner to fulfill the optional media requirement.
- `backend/` - Contains the PHP script (`submit.php`) to process the contact form.
  - Validates input.
  - Saves submissions to `data.json`.
  - Configured to send an auto-response to the user and a notification email to the administrators.

## How to Run the Project

Since this project contains a PHP backend that saves data to a local file, it must be run on a local server environment (like XAMPP, WAMP, or MAMP).

### Prerequisites
1. Download and install [XAMPP](https://www.apachefriends.org/index.html).
2. Start the **Apache** server from the XAMPP Control Panel.

### Installation & Execution
1. Clone this repository or download it as a ZIP file.
2. Copy the entire project folder into your XAMPP `htdocs` directory (usually located at `C:\xampp\htdocs\`).
3. Open your web browser and navigate to:
   ```
   http://localhost/eBEYONDS-Interview-Evaluation-Test/frontend/index.html
   ```
   *(Note: Adjust the folder name in the URL if you renamed the extracted folder).*

### Testing the Features
- **Responsive Design**: Resize your browser or use Developer Tools to see the layout adapt to Desktop, Tablet, and Mobile views.
- **TVMaze API**: Type a movie or show name (min 3 characters) into the search box under "Collect your favourites". Click the `+` button to add it to your grid. Click `X` to remove items from the grid.
- **Contact Form**: Fill out the form and submit. The frontend handles AJAX submission, and the PHP backend saves the data to `backend/data.json`.
