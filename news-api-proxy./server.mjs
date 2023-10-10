import express from 'express';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // Parse JSON request body


app.get('/getNews', async (req, res) => {
    try {
        const apiKey = '4c1a48a306154f6a823536d8756282e0'; // Replace with your News API key
        const response = await fetch(`https://newsapi.org/v2/everything?q=currency&apiKey=${apiKey}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ error: 'An error occurred while fetching news' });
    }
});

// Initialize exchange rates and currency symbols as null
let exchangeRates = null;
let currencySymbols = null;
let lastRatesFetchTimestamp = null;
let lastSymbolsFetchTimestamp = null;
const fetchIntervalMillis = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

async function fetchExchangeRatesAndSymbols() {
    try {
        const ratesResponse = await fetch('https://openexchangerates.org/api/latest.json?app_id=de6162a35a2d421796dbd4a58a02f2f0');
        const symbolsResponse = await fetch('https://openexchangerates.org/api/currencies.json');

        const ratesData = await ratesResponse.json();
        const symbolsData = await symbolsResponse.json();

        exchangeRates = ratesData.rates;

        // Format currency symbols as desired
        currencySymbols = {};
        for (const currencyCode in symbolsData) {
            currencySymbols[currencyCode] = symbolsData[currencyCode];
        }

        lastRatesFetchTimestamp = Date.now();
        lastSymbolsFetchTimestamp = Date.now();
        console.log('Exchange rates and currency symbols updated successfully.');
    } catch (error) {
        console.error('Error fetching exchange rates and currency symbols:', error);
    }
}

// Initial fetch of exchange rates and currency symbols
fetchExchangeRatesAndSymbols();

app.get('/getExchangeRates', (req, res) => {
    // Check if exchange rates are null or if it's been more than 12 hours since the last fetch
    const currentTime = Date.now();
    if (!exchangeRates || !lastRatesFetchTimestamp || currentTime - lastRatesFetchTimestamp >= fetchIntervalMillis) {
        // Fetch new exchange rates and currency symbols
        fetchExchangeRatesAndSymbols();
    }

    res.json({ rates: exchangeRates });
});

app.get('/getCurrencySymbols', (req, res) => {
    // Check if currency symbols are null or if it's been more than 12 hours since the last fetch
    const currentTime = Date.now();
    if (!currencySymbols || !lastSymbolsFetchTimestamp || currentTime - lastSymbolsFetchTimestamp >= fetchIntervalMillis) {
        // Fetch new currency symbols
        fetchExchangeRatesAndSymbols();
    }

    res.json(currencySymbols);
});


// Feedback submission endpoint
app.post('/submitFeedback', async (req, res) => {
  try {
    const feedbackText = req.body.feedbackText;

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'currencysnap@gmail.com',
        pass: 'tjtvuyuuxxqyscyg',
      },
    });

    // Set up email options
    const mailOptions = {
      from: 'mail@gmail.com',
      to: 'currencysnap@gmail.com',
      subject: 'New Feedback Received',
      text: feedbackText,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending feedback email:', error);
        res.status(500).json({ error: 'An error occurred while submitting feedback' });
      } else {
        res.status(200).json({ message: 'Feedback submitted successfully' });
      }
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'An error occurred while submitting feedback' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
