// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const stockSection = document.getElementById('stockSection');
const cryptoSection = document.getElementById('cryptoSection');
const chartSection = document.getElementById('chartSection');

// Stock Elements
const stockSymbol = document.getElementById('stockSymbol');
const stockPrice = document.getElementById('stockPrice');
const stockChange = document.getElementById('stockChange');
const stockChangePercent = document.getElementById('stockChangePercent');
const stockVolume = document.getElementById('stockVolume');

// Crypto Elements
const cryptoName = document.getElementById('cryptoName');
const cryptoPrice = document.getElementById('cryptoPrice');
const cryptoChange = document.getElementById('cryptoChange');
const cryptoMarketCap = document.getElementById('cryptoMarketCap');
const cryptoVolume = document.getElementById('cryptoVolume');

// Chart
let priceChart = null;

// Twelve Data API Key
const TWELVE_DATA_API_KEY = '76c2df412658461c9fdca92d87b51f53';

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    handleSearch();
  }
});

// Main Search Handler
async function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  
  if (!query) {
    showError('Please enter a stock symbol or cryptocurrency name');
    return;
  }

  hideError();
  hideAllSections();

  // Determine if it's a stock or crypto
  if (isCryptoQuery(query)) {
    await fetchCryptoData(query);
  } else {
    await fetchStockData(query.toUpperCase());
  }
}

// Check if query is a cryptocurrency
function isCryptoQuery(query) {
  const cryptoKeywords = ['bitcoin', 'ethereum', 'btc', 'eth', 'dogecoin', 'doge', 
                          'cardano', 'ada', 'ripple', 'xrp', 'solana', 'sol',
                          'polkadot', 'dot', 'litecoin', 'ltc', 'chainlink', 'link'];
  return cryptoKeywords.some(keyword => query.includes(keyword));
}

// Fetch Cryptocurrency Data
async function fetchCryptoData(coinId) {
  try {
    // Normalize coin ID
    const normalizedCoinId = normalizeCoinId(coinId);
    
    // Fetch current price and market data
    const priceResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${normalizedCoinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
    );

    if (!priceResponse.ok) {
      throw new Error('Cryptocurrency not found. Try: bitcoin, ethereum, dogecoin');
    }

    const data = await priceResponse.json();
    displayCryptoData(data);

    // Fetch historical data for chart (daily intervals for smoother chart)
    const historyResponse = await fetch(
      `https://api.coingecko.com/api/v3/coins/${normalizedCoinId}/market_chart?vs_currency=usd&days=7&interval=daily`
    );

    if (historyResponse.ok) {
      const historyData = await historyResponse.json();
      displayChart(historyData.prices, data.name);
    }

  } catch (error) {
    showError(error.message);
  }
}

// Normalize cryptocurrency ID
function normalizeCoinId(query) {
  const coinMap = {
    'btc': 'bitcoin',
    'eth': 'ethereum',
    'doge': 'dogecoin',
    'ada': 'cardano',
    'xrp': 'ripple',
    'sol': 'solana',
    'dot': 'polkadot',
    'ltc': 'litecoin',
    'link': 'chainlink'
  };
  return coinMap[query] || query;
}

// Display Cryptocurrency Data
function displayCryptoData(data) {
  const marketData = data.market_data;
  
  // Update DOM with crypto data
  cryptoName.textContent = data.name;
  cryptoPrice.textContent = `$${formatNumber(marketData.current_price.usd)}`;
  
  const priceChange24h = marketData.price_change_percentage_24h;
  cryptoChange.textContent = `${priceChange24h.toFixed(2)}%`;
  
  // Apply dynamic styling
  if (priceChange24h >= 0) {
    cryptoChange.classList.add('positive');
    cryptoChange.classList.remove('negative');
  } else {
    cryptoChange.classList.add('negative');
    cryptoChange.classList.remove('positive');
  }
  
  cryptoMarketCap.textContent = `$${formatNumber(marketData.market_cap.usd)}`;
  cryptoVolume.textContent = `$${formatNumber(marketData.total_volume.usd)}`;
  
  // Show crypto section
  showSection(cryptoSection);
}

// Fetch Stock Data
async function fetchStockData(symbol) {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${TWELVE_DATA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch stock data');
    }

    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'Stock symbol not found. Try: AAPL, TSLA, GOOGL, MSFT');
    }

    if (!data.symbol) {
      throw new Error('Stock symbol not found. Try: AAPL, TSLA, GOOGL, MSFT');
    }

    displayStockData(data, symbol);
    
    // Fetch historical data for chart (no delay needed for Twelve Data)
    await fetchStockHistory(symbol);

  } catch (error) {
    showError(error.message);
  }
}

// Display Stock Data
function displayStockData(quote, symbol) {
  // Update DOM with stock data
  stockSymbol.textContent = quote.symbol;
  stockPrice.textContent = `$${parseFloat(quote.close).toFixed(2)}`;
  
  const change = parseFloat(quote.change);
  const changePercent = parseFloat(quote.percent_change);
  
  stockChange.textContent = `$${change.toFixed(2)}`;
  stockChangePercent.textContent = `${changePercent.toFixed(2)}%`;
  
  // Apply dynamic styling
  if (change >= 0) {
    stockChange.classList.add('positive');
    stockChange.classList.remove('negative');
    stockChangePercent.classList.add('positive');
    stockChangePercent.classList.remove('negative');
  } else {
    stockChange.classList.add('negative');
    stockChange.classList.remove('positive');
    stockChangePercent.classList.add('negative');
    stockChangePercent.classList.remove('positive');
  }
  
  stockVolume.textContent = formatNumber(parseInt(quote.volume));
  
  // Show stock section
  showSection(stockSection);
}

// Fetch Stock Historical Data
async function fetchStockHistory(symbol) {
  try {
    const response = await fetch(
      `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&outputsize=8&apikey=${TWELVE_DATA_API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch historical data');
    }

    const data = await response.json();
    
    // Check for API errors
    if (data.status === 'error') {
      console.warn('Stock chart unavailable:', data.message);
      return;
    }

    if (data.values && data.values.length > 0) {
      const prices = [];
      
      // Reverse to get chronological order
      const values = data.values.reverse();
      
      values.forEach(item => {
        prices.push([
          new Date(item.datetime).getTime(),
          parseFloat(item.close)
        ]);
      });

      displayChart(prices, symbol);
    } else {
      console.warn('Stock chart unavailable: No time series data in response');
    }

  } catch (error) {
    console.error('Error fetching stock history:', error);
    // Don't show error to user - chart is optional, stock data is already shown
  }
}

// Display Chart
function displayChart(priceData, label) {
  const ctx = document.getElementById('priceChart').getContext('2d');
  
  // Destroy existing chart if it exists
  if (priceChart) {
    priceChart.destroy();
  }

  // Prepare data for Chart.js
  const labels = priceData.map(point => {
    const date = new Date(point[0]);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const prices = priceData.map(point => point[1]);

  // Create new chart
  priceChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: `${label} Price (USD)`,
        data: prices,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: '#f1f5f9',
            font: {
              size: 14
            }
          }
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: '#1e293b',
          titleColor: '#f1f5f9',
          bodyColor: '#f1f5f9',
          borderColor: '#334155',
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            label: function(context) {
              return `Price: $${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#334155',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: {
              size: 12
            }
          }
        },
        y: {
          grid: {
            color: '#334155',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            font: {
              size: 12
            },
            callback: function(value) {
              return '$' + value.toFixed(2);
            }
          }
        }
      }
    }
  });

  // Show chart section
  showSection(chartSection);
}

// Utility Functions

function showSection(section) {
  section.classList.remove('hidden');
}

function hideSection(section) {
  section.classList.add('hidden');
}

function hideAllSections() {
  hideSection(stockSection);
  hideSection(cryptoSection);
  hideSection(chartSection);
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

function hideError() {
  errorMessage.classList.add('hidden');
  errorMessage.textContent = '';
}

function formatNumber(num) {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

// Initialize
console.log('Finova Market Data Viewer initialized');
console.log('Try searching for: bitcoin, ethereum, AAPL, TSLA, MSFT');
