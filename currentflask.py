import yfinance as yf
import pandas as pd
from flask import Flask, jsonify, render_template_string
from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
import threading

app = Flask(__name__)
TICKERS = [
    'ADANIENT.NS', 'ADANIPORTS.NS', 'APOLLOHOSP.NS', 'ASIANPAINT.NS', 'AXISBANK.NS',
    'BAJAJ-AUTO.NS', 'BAJFINANCE.NS', 'BAJAJFINSV.NS', 'BPCL.NS', 'BHARTIARTL.NS',
    'BRITANNIA.NS', 'CIPLA.NS', 'COALINDIA.NS', 'DIVISLAB.NS', 'DRREDDY.NS',
    'EICHERMOT.NS', 'GRASIM.NS', 'HCLTECH.NS', 'HDFCBANK.NS', 'HDFCLIFE.NS',
    'HEROMOTOCO.NS', 'HINDALCO.NS', 'HINDUNILVR.NS', 'ICICIBANK.NS', 'ITC.NS',
    'INDUSINDBK.NS', 'INFY.NS', 'JSWSTEEL.NS', 'KOTAKBANK.NS', 'LTIM.NS',
    'LT.NS', 'M&M.NS', 'MARUTI.NS', 'NTPC.NS', 'NESTLEIND.NS', 'ONGC.NS',
    'POWERGRID.NS', 'RELIANCE.NS', 'SBILIFE.NS', 'SBIN.NS', 'SUNPHARMA.NS',
    'TCS.NS', 'TATACONSUM.NS', 'TATAMOTORS.NS', 'TATASTEEL.NS', 'TECHM.NS',
    'TITAN.NS', 'ULTRACEMCO.NS', 'UPL.NS', 'WIPRO.NS'
]

live_data_store = {}
data_lock = threading.Lock()

def fetch_live_data():
    """Background task to fetch current price, volume, and fundamentals."""
    print(f"[{datetime.now()}] Refreshing Live Market Data...")
    global live_data_store
    
    try:
        market_data = yf.download(TICKERS, period="1d", interval="1m", group_by='ticker', progress=False)
        
        new_records = []
        tickers_obj = yf.Tickers(" ".join(TICKERS))
        
        for symbol in TICKERS:
            try:
                
                ticker_subset = market_data[symbol].dropna()
                current_price = ticker_subset['Close'].iloc[-1] if not ticker_subset.empty else None
                current_volume = ticker_subset['Volume'].iloc[-1] if not ticker_subset.empty else None                
                info = tickers_obj.tickers[symbol].info
                record = {
                    "Symbol": symbol,
                    "CurrentPrice": float(current_price) if current_price is not None else "N/A",
                    "Sector": info.get('sector', 'N/A'),
                    "Volume": int(current_volume) if current_volume is not None else "N/A",
                    "MarketCap": int(info.get('marketCap', 0)) if info.get('marketCap') else "N/A",
                    "PE_Ratio": float(info.get('trailingPE')) if info.get('trailingPE') else "N/A",
                    "LastUpdated": datetime.now().strftime("%H:%M:%S")
                }
                new_records.append(record)
            except Exception as e:
                print(f"Error processing {symbol}: {e}")
        with data_lock:
            live_data_store = new_records
        pd.DataFrame(new_records).to_csv("Live_Portfolio_Data.csv", index=False)
        print("Live data updated successfully.")
        
    except Exception as e:
        print(f"General Fetch Error: {e}")
scheduler = BackgroundScheduler()
scheduler.add_job(func=fetch_live_data, trigger="interval", minutes=2)
scheduler.start()
@app.route('/')
def index():
    """Simple HTML view to see the data."""
    with data_lock:
        data = live_data_store
    html = """
    <html>
        <head>
            <title>Live Nifty Portfolio</title>
            <meta http-equiv="refresh" content="30"> <style>
                table { border-collapse: collapse; width: 100%; font-family: sans-serif; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                tr:nth-child(even){background-color: #f2f2f2;}
                th { background-color: #04AA6D; color: white; }
            </style>
        </head>
        <body>
            <h2>Live Nifty 50 Data (Refreshes every 2 mins)</h2>
            <p>Last Global Update: {{ timestamp }}</p>
            <table>
                <tr>
                    <th>Symbol</th><th>Price</th><th>Sector</th><th>Volume</th><th>Market Cap</th><th>P/E</th><th>Updated</th>
                </tr>
                {% for item in portfolio %}
                <tr>
                    <td>{{ item.Symbol }}</td>
                    <td>{{ item.CurrentPrice }}</td>
                    <td>{{ item.Sector }}</td>
                    <td>{{ "{:,}".format(item.Volume) if item.Volume != 'N/A' else 'N/A' }}</td>
                    <td>{{ "{:,}".format(item.MarketCap) if item.MarketCap != 'N/A' else 'N/A' }}</td>
                    <td>{{ item.PE_Ratio }}</td>
                    <td>{{ item.LastUpdated }}</td>
                </tr>
                {% endfor %}
            </table>
        </body>
    </html>
    """
    return render_template_string(html, portfolio=data, timestamp=datetime.now().strftime("%H:%M:%S"))

@app.route('/api/data')
def get_data_json():
    """API endpoint to get the live data as JSON."""
    with data_lock:
        return jsonify(live_data_store)

if __name__ == '__main__':
    fetch_live_data()
    try:
        app.run(debug=False, port=5000)
    except (KeyboardInterrupt, SystemExit):
        scheduler.shutdown()