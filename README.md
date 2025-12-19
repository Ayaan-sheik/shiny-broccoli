# Finova Market Data Viewer

A fully functional frontend web application that fetches and displays real-time stock and cryptocurrency market data using vanilla JavaScript, HTML, and CSS.

## 🎯 Project Overview

This application allows users to:
- Search for stocks (e.g., AAPL, TSLA, MSFT) and cryptocurrencies (e.g., bitcoin, ethereum)
- View real-time market prices and statistics
- Visualize 7-day price history using interactive charts
- Experience dynamic UI updates without page reloads

## 🛠️ Technologies Used

- **HTML5**: Structure and semantic markup
- **CSS3**: Styling, animations, and responsive design
- **JavaScript (Vanilla)**: DOM manipulation, API integration, and dynamic functionality
- **Chart.js**: Data visualization library for price charts
- **APIs**:
  - CoinGecko API (Cryptocurrency data)
  - Alpha Vantage API (Stock market data)

## 📁 File Structure

```
finova-market-viewer/
├── index.html          # Main HTML structure
├── style.css           # CSS styling and responsive design
├── script.js           # JavaScript logic and API integration
└── README.md           # Project documentation
```

## 🔄 DOM Manipulation Explained

### What is DOM Manipulation?

The **Document Object Model (DOM)** is a programming interface that represents the structure of an HTML document as a tree of objects. DOM manipulation allows JavaScript to dynamically update the webpage content, structure, and styling **without reloading the page**.

### How This Project Uses DOM Manipulation

#### 1. **Reading User Input Without Reload**
```javascript
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', handleSearch);
```
- Uses `getElementById()` to access DOM elements
- Uses `addEventListener()` to detect button clicks
- No page reload occurs - JavaScript handles everything

#### 2. **Dynamically Updating Price Information**
```javascript
cryptoPrice.textContent = `$${formatNumber(marketData.current_price.usd)}`;
stockPrice.textContent = `$${parseFloat(quote['05. price']).toFixed(2)}`;
```
- Uses `textContent` to update element content
- Updates happen instantly without refreshing the page
- Real API data replaces placeholder values

#### 3. **Showing and Hiding Sections Dynamically**
```javascript
function showSection(section) {
  section.classList.remove('hidden');
}

function hideSection(section) {
  section.classList.add('hidden');
}
```
- Uses `classList.add()` and `classList.remove()` to toggle visibility
- Shows Stock section for stock data, Crypto section for crypto data
- Hides unused sections dynamically based on user search

#### 4. **Dynamic Styling Based on Data**
```javascript
if (priceChange24h >= 0) {
  cryptoChange.classList.add('positive');
  cryptoChange.classList.remove('negative');
} else {
  cryptoChange.classList.add('negative');
  cryptoChange.classList.remove('positive');
}
```
- Adds `positive` class (green color) for price increases
- Adds `negative` class (red color) for price decreases
- Styling changes dynamically based on API data

#### 5. **Updating Chart Without Page Reload**
```javascript
if (priceChart) {
  priceChart.destroy();  // Remove old chart
}
priceChart = new Chart(ctx, { ... });  // Create new chart
```
- Destroys existing chart before creating a new one
- Updates chart data dynamically when new searches are made
- No page reload required

#### 6. **Error Handling Using DOM Manipulation**
```javascript
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}
```
- Displays error messages inside the UI (not browser alerts)
- Error messages appear dynamically in a dedicated section
- Errors are cleared automatically on new searches

## 📊 Data Flow Architecture

```
┌─────────────────┐
│   User Input    │
│  (Search Box)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Listener │
│   (JavaScript)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Determine Type  │
│ Stock or Crypto │
└────┬───────┬────┘
     │       │
     ▼       ▼
┌─────────┐ ┌──────────────┐
│  Stock  │ │    Crypto    │
│   API   │ │     API      │
│(Alpha V)│ │  (CoinGecko) │
└────┬────┘ └──────┬───────┘
     │             │
     ▼             ▼
┌─────────────────────────┐
│   Process API Response  │
│     (JavaScript)        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   DOM Manipulation      │
│ - Update text content   │
│ - Show/hide sections    │
│ - Apply styling         │
│ - Render chart          │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│   Updated UI Display    │
│  (No Page Reload!)      │
└─────────────────────────┘
```

## 🚀 How to Run the Project

### Prerequisites
1. A modern web browser (Chrome, Firefox, Edge, Safari)
2. A text editor (VS Code recommended)
3. Git installed on your system

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd finova-market-viewer
```

2. **Open the project**
   - Simply open `index.html` in your web browser
   - Or use VS Code Live Server extension for better development experience

3. **Get Alpha Vantage API Key (Optional)**
   - Visit: https://www.alphavantage.co/support/#api-key
   - Sign up for a free API key
   - Replace `'demo'` in `script.js` with your API key:
   ```javascript
   const ALPHA_VANTAGE_API_KEY = 'YOUR_API_KEY_HERE';
   ```

## 💡 Usage Examples

### Search for Cryptocurrency
- Enter: `bitcoin`, `ethereum`, `dogecoin`, or `btc`, `eth`
- Click **Search** or press **Enter**
- View live price, 24h change, market cap, volume, and 7-day chart

### Search for Stock
- Enter: `AAPL`, `TSLA`, `MSFT`, `GOOGL`
- Click **Search** or press **Enter**
- View current price, change, change %, volume, and 7-day chart

## 📸 Screenshots

### UI Preview
![Finova Market Viewer UI](./screenshots/ui-preview.png)
*Screenshot showing the main interface with search bar and data sections*

### Cryptocurrency Data Display
![Crypto Data](./screenshots/crypto-data.png)
*Example of Bitcoin data with price information and chart*

### Stock Data Display
![Stock Data](./screenshots/stock-data.png)
*Example of Apple (AAPL) stock data with price information and chart*

### Price Chart Visualization
![Price Chart](./screenshots/chart-output.png)
*7-day price history chart with interactive tooltips*

> **Note**: Screenshots should be taken after running the application and saved in a `screenshots/` folder.

## 🎨 Features Implemented

### ✅ Required Features
- [x] Search input field for stocks and cryptocurrencies
- [x] Search button with click and Enter key support
- [x] Stock information section with dynamic data
- [x] Cryptocurrency information section with dynamic data
- [x] Chart.js integration for price visualization
- [x] 7-day historical price data display
- [x] Responsive design for mobile and desktop

### ✅ DOM Manipulation Requirements
- [x] Read user input without page reload
- [x] Dynamically update price information
- [x] Show/hide sections based on search type
- [x] Dynamic styling (green for positive, red for negative changes)
- [x] Update chart without page reload
- [x] Error handling with UI messages (no alerts)

### ✅ Additional Features
- [x] Loading states and error messages
- [x] Number formatting (K, M, B for large numbers)
- [x] Smooth animations and transitions
- [x] Dark theme UI design
- [x] Mobile-responsive layout

## 🔧 Technical Implementation

### API Integration

#### CoinGecko API (No API Key Required)
```javascript
// Get current crypto price and details
https://api.coingecko.com/api/v3/coins/{coin-id}

// Get historical price data (7 days)
https://api.coingecko.com/api/v3/coins/{coin-id}/market_chart?vs_currency=usd&days=7
```

#### Alpha Vantage API (Free Tier)
```javascript
// Get current stock quote
https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={SYMBOL}&apikey={KEY}

// Get historical stock data
https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol={SYMBOL}&apikey={KEY}
```

### Key JavaScript Functions

| Function | Purpose |
|----------|---------|
| `handleSearch()` | Main search handler, determines stock or crypto |
| `fetchCryptoData()` | Fetches cryptocurrency data from CoinGecko |
| `fetchStockData()` | Fetches stock data from Alpha Vantage |
| `displayCryptoData()` | Updates DOM with crypto information |
| `displayStockData()` | Updates DOM with stock information |
| `displayChart()` | Creates/updates Chart.js visualization |
| `showSection()` / `hideSection()` | Toggles section visibility |
| `showError()` / `hideError()` | Displays/hides error messages |

## 📚 Git Workflow Commands

### Initial Setup
```bash
# Initialize git repository
git init

# Add remote repository
git remote add origin <repository-url>

# Check status
git status
```

### Making Changes
```bash
# Stage all changes
git add .

# Or stage specific files
git add index.html style.css script.js

# Commit changes
git commit -m "feat: implement stock and crypto data viewer"

# Push to remote repository
git push origin main
```

### Viewing History
```bash
# View commit history
git log

# View changes
git diff

# View remote repository
git remote -v
```

## 🐛 Known Limitations

1. **Alpha Vantage Rate Limit**: Free tier allows 5 API calls per minute. Consider upgrading or using your own API key.
2. **Demo API Key**: The demo API key only works for limited symbols. Get your own key for full functionality.
3. **CoinGecko Rate Limit**: Free tier has rate limits. If you get errors, wait a minute before trying again.

## 🔮 Future Enhancements

- [ ] Add loading spinners during API calls
- [ ] Support for multiple cryptocurrency comparisons
- [ ] Add favorite stocks/cryptos with local storage
- [ ] Implement real-time price updates with WebSockets
- [ ] Add more chart types (candlestick, bar chart)
- [ ] Currency conversion (EUR, GBP, etc.)
- [ ] Dark/Light theme toggle
- [ ] Export chart data as CSV

## 👨‍💻 Author

**Your Name**
- Task: Stock & Crypto Data Viewer (Task 2)
- Organization: Mancomm - FinTech Development

## 📝 Assignment Details

**Designed by**: Ayaan Sheik, Mancomm

**Mentors**:
- Ayaan Sheik
- Aditya Vardhan Pola
- Sharanya Yelluru

**Submitted by**: Pranav

## 📄 License

This project is created for educational purposes as part of the Mancomm FinTech Development program.

## 🙏 Acknowledgments

- CoinGecko API for cryptocurrency data
- Alpha Vantage API for stock market data
- Chart.js for data visualization
- Mancomm FinTech Development Team

---

**Note**: This project demonstrates proficiency in vanilla JavaScript, DOM manipulation, API integration, and modern web development practices without using any frameworks.
