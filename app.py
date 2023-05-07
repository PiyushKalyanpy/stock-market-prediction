from flask import Flask, request
import pandas as pd
import numpy as np
import joblib
import datetime
import json 
import yfinance as yf
from textblob import TextBlob

app = Flask(__name__)

models = {
    'AAPL': joblib.load('models/aapl_model'),
    'GOOG': joblib.load('models/google_model'),
    'META': joblib.load('models/meta_model'),
    'AMZN': joblib.load('models/amzn_model'),
    'F': joblib.load('models/ford_model'),
    'TSLA': joblib.load('models/tesla_model'),
    'ADANIENT.NS': joblib.load('models/adani_model'),
}

def prediction(model, data):
    input_array = np.array(data).reshape(1, -1)
    data = eval(input_array[0][0]['predictions'])
    open = data['Open']['1683259200000']
    close = data['Close']['1683259200000']
    low = data['Low']['1683259200000']
    high = data['High']['1683259200000']
    todays_data = pd.DataFrame({'Open': [open], 'Close': [close], 'Low': [low], 'High': [high]})
    predictions = model.predict(todays_data)
    return predictions.tolist()
    
@app.route('/')
def home():
    return 'Hello, World!'

def get_values(company):
    aapl = yf.Ticker(company)
    hist = aapl.history(period='')
    df = pd.DataFrame.from_dict(hist)
    print(df)
    return {'predictions': df.tail(1).to_json()}

@app.route('/predict/<company_name>', methods=['GET'])
def add(company_name):
    data = get_values(company_name)
    model = models[company_name]
    result = prediction(model, data)
    return result


@app.route('/get_news/<company_name>', methods=['GET'])
def get_news(company_name):
    company = yf.Ticker(company_name)
    df = pd.DataFrame.from_dict(company.news)
    

    news_data = []
    for i in df.index:
        title = df['title'][i]
        thumbnail = df['thumbnail'][i]
        date=datetime.datetime.fromtimestamp(df['providerPublishTime'][i])
        link=df['link'][i]
        related_companies = df['relatedTickers'][i]
        sentiment=TextBlob(title).sentiment.polarity
        publisher=df['publisher'][i]
        data_dict = {'title': title, 'thumbnail': thumbnail, 'date': date, 'publisher': publisher, 'link': link, 'related_companies': related_companies, 'sentiment': sentiment}
        news_data.append(data_dict)
    return news_data
    
    
if __name__ == '__main__':
    app.run(debug=True)