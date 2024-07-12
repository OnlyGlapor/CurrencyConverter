# Currency Converter Project

## Overview

This project is a Currency Converter web application that utilizes HTML, CSS, and JavaScript along with the OpenExchange API for currency exchange rates and the NewsAPI for displaying related news. It allows users to convert between different currencies and stay updated with relevant news.

## Features

- **Currency Conversion**: Convert between different currencies using real-time exchange rates.
- **Latest News**: Display latest news related to currency markets using the NewsAPI.
- **User-friendly Interface**: Simple and intuitive interface for easy navigation and usage.

## Technologies Used

- HTML
- CSS
- JavaScript
- OpenExchange API
- NewsAPI

## Setup Instructions

To run this project locally, follow these steps:

1. **Clone Repository**:
   ```bash
   git clone https://github.com/your-username/currency-converter.git
   cd currency-converter
   ```

2. **API Keys**:
   - Get your API keys for OpenExchange API and NewsAPI.
   - Create a file named `config.js` in the root directory.
   - Add your API keys to `config.js`:
     ```javascript
     const openExchangeApiKey = 'YOUR_OPENEXCHANGE_API_KEY';
     const newsApiKey = 'YOUR_NEWSAPI_API_KEY';

     export { openExchangeApiKey, newsApiKey };
     ```

3. **Open `index.html`**:
   - Open `index.html` in your web browser.

## Screenshots

(Optional: Include screenshots of your application to provide visual context.)

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.

---
