// script.js

let exchangeRates = {};
let currencySymbols = {};

function updateExchangeRates() {
    const exchangeRatesUrl = 'http://localhost:3000/getExchangeRates';
    const currencySymbolsUrl = 'http://localhost:3000/getCurrencySymbols';

    fetch(exchangeRatesUrl)
        .then((response) => response.json())
        .then((data) => {
            exchangeRates = data.rates;
            updateCurrencyDropdowns();
        })
        .catch((error) => {
            console.error('Error fetching exchange rates:', error);
        });

    fetch(currencySymbolsUrl)
        .then((response) => response.json())
        .then((data) => {
            currencySymbols = data;
            updateCurrencyDropdowns();
        })
        .catch((error) => {
            console.error('Error fetching currency symbols:', error);
        });
}

function updateCurrencyDropdowns() {
    const currencyOptions = Object.keys(exchangeRates);

    fromCurrencySelect.innerHTML = "";
    toCurrencySelect.innerHTML = "";

    currencyOptions.forEach((currency) => {
        const option = document.createElement("option");
        option.value = currency;
        option.textContent = `${currency} (${currencySymbols[currency]})`;
        fromCurrencySelect.appendChild(option);
    });

    currencyOptions.forEach((currency) => {
        if (currency !== fromCurrencySelect.value) {
            const option = document.createElement("option");
            option.value = currency;
            option.textContent = `${currency} (${currencySymbols[currency]})`;
            toCurrencySelect.appendChild(option);
        }
    });
}

const fromCurrencySelect = document.getElementById("fromCurrency");
const toCurrencySelect = document.getElementById("toCurrency");
const amountInput = document.getElementById("amount");
const convertedAmountInput = document.getElementById("convertedAmount");
const convertButton = document.getElementById("convertButton");

function convertCurrency() {
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount)) {
        alert("Please enter a valid amount.");
        return;
    }

    if (fromCurrency === toCurrency) {
        alert("Please select different currencies.");
        return;
    }

    if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        alert("Selected currencies are not supported.");
        return;
    }

    const conversionRate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
    const convertedAmount = (amount * conversionRate).toFixed(2);

    convertedAmountInput.value = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
}

convertButton.addEventListener("click", convertCurrency);

amountInput.addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        convertCurrency();
    }
});

const getHistoricalRatesButton = document.getElementById("getHistoricalRates");
getHistoricalRatesButton.addEventListener("click", getHistoricalRates);

function getHistoricalRates() {
    const selectedDate = document.getElementById("date").value;
    const fromCurrency = fromCurrencySelect.value;
    const toCurrency = toCurrencySelect.value;
    const amount = parseFloat(amountInput.value);

    if (!selectedDate) {
        alert("Please select a date.");
        return;
    }

    const historicalRatesUrl = `https://openexchangerates.org/api/historical/${selectedDate}.json?app_id=de6162a35a2d421796dbd4a58a02f2f0&base=${fromCurrency}`;

    fetch(historicalRatesUrl)
        .then((response) => response.json())
        .then((data) => {
            if (!data.rates || !data.rates[toCurrency]) {
                alert("Historical rates not available for the selected currencies.");
                return;
            }

            const historicalRate = data.rates[toCurrency];
            const formattedDate = new Date(selectedDate).toDateString();

            const equivalentAmount = (amount * historicalRate).toFixed(2);

            // Fetch the actual rate from the API for the historical date
            const actualRateUrl = `https://openexchangerates.org/api/historical/${selectedDate}.json?app_id=de6162a35a2d421796dbd4a58a02f2f0`;
            
            fetch(actualRateUrl)
                .then((response) => response.json())
                .then((actualRateData) => {
                    if (!actualRateData.rates || !actualRateData.rates[toCurrency]) {
                        alert("Actual rates not available for the selected currencies.");
                        return;
                    }

                    const actualRate = actualRateData.rates[toCurrency].toFixed(4);
                    const actualRateText = `(At the actual rate of ${actualRate})`;

                    const resultText = `${amount} ${fromCurrency} on ${formattedDate} = ${equivalentAmount} ${toCurrency} ${actualRateText}`;
                    document.getElementById("historicalRates").textContent = resultText;
                })
                .catch((error) => {
                    console.error("Error fetching actual rates:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching historical rates:", error);
        });
}

updateExchangeRates();



// Get references to the drawer and open button
const drawer = document.querySelector('.drawer');
const openDrawerButton = document.getElementById('openDrawerButton');
const closeDrawerButton = document.getElementById('closeDrawerButton')

// Toggle the drawer when the button is clicked
openDrawerButton.addEventListener('click', () => {
    drawer.classList.toggle('active');
});

closeDrawerButton.addEventListener('click', () => {
    drawer.classList.toggle('active');
});



const calculator = document.getElementById('Calculator');
const openCalButton = document.getElementById("openCalButton");

let isDragging = false;
let offsetX, offsetY;

calculator.addEventListener('mousedown', (e) => {
  isDragging = true;
  offsetX = e.clientX - calculator.getBoundingClientRect().left;
  offsetY = e.clientY - calculator.getBoundingClientRect().top;
  calculator.classList.add('dragging');
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const newX = e.clientX - offsetX;
  const newY = e.clientY - offsetY;
  calculator.style.left = `${newX}px`;
  calculator.style.top = `${newY}px`;
});

document.addEventListener('mouseup', () => {
  if (isDragging) {
    calculator.classList.remove('dragging');
    isDragging = false;
  }
});

function addToDisplay(value) {
    document.getElementById("display").value += value;
}

function clearDisplay(){
    document.getElementById("display").value = "";
}

function calculateResult() {
    try {
        const result = eval(document.getElementById("display").value);
        document.getElementById("display").value = result;
    } catch (error) {
        document.getElementById("display").value = "Error";
    }
}

const closeCalculator = document.getElementById('close-calculator-button');

function toggleCalculator() {
    if (calculator.style.display === 'none' || calculator.style.display === '' || openCalButton.style.display === 'block') {
        calculator.style.display = 'block';
        openCalButton.style.display = 'none'
    } else {
        calculator.style.display = 'none';
        openCalButton.style.display = 'block'
    }
}

closeCalculator.addEventListener('click', () => {
      toggleCalculator();
});

openCalButton.addEventListener('click', () => {
      toggleCalculator();
});


// Scripts for the Currency News Sidebar

// const apiKey = '4c1a48a306154f6a823536d8756282e0'; // Replace with your News API key
const newsContainer = document.querySelector('.sidebar');

const loader = document.querySelector('.sidebar #loader');

// Function to fetch and display news articles
async function fetchCurrencyNews() {
    try {
        const response = await fetch(`http://localhost:3000/getNews`);
        const data = await response.json();

        // Hide the loader after data is fetched
        loader.style.display = 'none';


        if (data.status === 'ok') {
            // Iterate through the articles and display them in the sidebar
            data.articles.forEach((article) => {
                const newsItem = document.createElement('div');
                newsItem.classList.add('news-item');

                const itemLeft = document.createElement('div');
                itemLeft.classList.add('item-left');

                const itemRight = document.createElement('div');
                itemRight.classList.add('item-right');

                const img = document.createElement('img');
                img.src = article.urlToImage;
                itemLeft.appendChild(img);

                // Create an anchor tag with the article URL as the href
                const a = document.createElement('a');
                a.href = article.url;
                a.target = '_blank'; // Open link in a new tab

                // Create an <h4> element within the anchor tag
                const h4 = document.createElement('h4');
                h4.textContent = article.title;

                // Apply CSS styles to the <a> element to make it appear as plain text
                a.style.textDecoration = 'none'; // Remove underline
                a.style.color = 'black'; // Set text color to black

                // Append the <h4> element within the <a> element
                a.appendChild(h4);

                // Append the <a> element to the itemLeft div
                itemLeft.appendChild(a);

                const p = document.createElement('p');
                p.textContent = 'Published ' + new Date(article.publishedAt).toLocaleString();
                itemLeft.appendChild(p);

                newsItem.appendChild(itemLeft);
                newsItem.appendChild(itemRight);

                newsContainer.appendChild(newsItem);
            });
        } else {
            console.error('News API returned an error:', data.message);
            // Display an error message to the user
            const errorMessage = document.createElement('div');
            errorMessage.textContent = 'Failed to fetch news articles. Please try again later.';
            errorMessage.classList.add('news-error-message');
            newsContainer.appendChild(errorMessage);
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        // Display a generic error message to the user
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'An error occurred while fetching news articles.';
        errorMessage.classList.add('news-error-message');
        newsContainer.appendChild(errorMessage);
    }
}

// Call the function to fetch currency news when the page loads
fetchCurrencyNews();


// Function to update the marquee with exchange rates
function updateMarquee() {
  const marquee = document.querySelector('marquee'); // Select the <marquee> element

  if (!marquee) return; // Ensure the marquee element exists

  // Clear the existing content
  marquee.innerHTML = '';

  // Iterate through the exchange rates object and add each rate to the marquee
  for (const currency in exchangeRates) {
    const rate = exchangeRates[currency];
    const currencySymbol = currencySymbols[currency] || currency;
    const rateString = `${currencySymbol}: ${rate.toFixed(2)}`;
    const rateElement = document.createElement('span');
    rateElement.textContent = rateString;
    marquee.appendChild(rateElement);
    marquee.appendChild(document.createTextNode(' | ')); // Add a separator
  }
}

// Call the function to initially update the marquee
updateMarquee();

// Call the function to update the marquee every 10 seconds (adjust the interval as needed)
setInterval(updateMarquee, 10000);


// JavaScript to handle the feedback modal

// Get the modal and button elements
const feedbackModal = document.getElementById("feedbackModal");
const openFeedbackModalButton = document.getElementById("openFeedbackModal");
const closeFeedbackModalButton = document.getElementById("closeFeedbackModal");

// Open the feedback modal when the button is clicked
openFeedbackModalButton.addEventListener("click", () => {
  feedbackModal.style.display = "block";
});

// Close the feedback modal when the close button is clicked
closeFeedbackModalButton.addEventListener("click", () => {
  feedbackModal.style.display = "none";
});

// Close the feedback modal if the user clicks outside of it
window.addEventListener("click", (event) => {
  if (event.target == feedbackModal) {
    feedbackModal.style.display = "none";
  }
});


// // JavaScript to handle feedback submission

// // Get the submit button and feedback text area
// const submitFeedbackButton = document.getElementById("submitFeedback");
// const feedbackTextArea = document.getElementById("feedbackText");

// // Add an event listener to the submit button
// submitFeedbackButton.addEventListener("click", () => {
//   // Get the feedback text
//   const feedbackText = feedbackTextArea.value;

//   // You can send the feedback to your server or perform any other desired action here

//   // Close the feedback modal
//   feedbackModal.style.display = "none";

//   // Optionally, you can display a confirmation message to the user
//   alert("Thank you for your feedback!");
// });


// JavaScript to handle feedback submission

// Get the submit button and feedback text area
const submitFeedbackButton = document.getElementById("submitFeedback");
const feedbackTextArea = document.getElementById("feedbackText");

// Add an event listener to the submit button
submitFeedbackButton.addEventListener("click", () => {
  // Get the feedback text
  const feedbackText = feedbackTextArea.value;

  // Make a POST request to submit feedback
  fetch('http://localhost:3000/submitFeedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ feedbackText }),
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);

      // Optionally, display a confirmation message to the user
      alert("Thank you for your feedback!");
    })
    .catch(error => {
      console.error('Error submitting feedback:', error);

      // Handle errors as needed
      alert("An error occurred while submitting feedback. Please try again.");
    });

  // Close the feedback modal
  feedbackModal.style.display = "none";
});
