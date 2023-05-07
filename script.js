const companyNames = {
  AAPL: "Apple Inc.",
  AMZN: "Amazon.com, Inc.",
  GOOG: "Alphabet Inc.",
  TSLA: "Tesla, Inc.",
  F: "Ford Motor Company",
  META: "Meta Platforms, Inc.",
  "ADANIENT.NS": "Adani Enterprises Limited",
};

const predict = async (company_name) => {
  await fetch(`http://127.0.0.1:5000/predict/${company_name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("company_name").innerHTML =
        companyNames[company_name];
      document.getElementById("company_tag").innerHTML = company_name;
      document.getElementById("predicted_value").innerHTML = data;
      getNewsData(company_name);
    });
};

const getNewsData = async (company_name) => {
  await fetch(`http://localhost:5000/get_news/${company_name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      setNewsData(data);
    });
};

const navigateTo = (link) => {
  window.location.href = link;
};

const getSentiment = async (sentiment_value) => {
  console.log(sentiment_value);
  let sentimentValues = {};
  if (sentiment_value > 0.0) {
    sentimentValues = {
      bgColor: "bg-green-50",
      text: "Positive",
      textColor: "text-green-500",
    };
  } else if (sentiment_value < 0.0) {
    sentimentValues = {
      bgColor: "bg-red-50",
      text: "Negative",
      textColor: "text-red-500",
    };
  } else {
    sentimentValues = {
      bgColor: "bg-gray-50",
      text: "Neutral",
      textColor: "text-gray-500",
    };
  }
  return sentimentValues;
};

const setNewsData = (data) => {
  innerDataHtml = "";
  data.forEach((element) => {
    const date = new Date(element.date);
    const formattedDate = date.toDateString();
    let sentiment_value = element.sentiment;
    let sentimentValues = {};
    // getting sentiment value
    if (sentiment_value > 0.0) {
      sentimentValue = {
        bgColor: "bg-green-50",
        text: "Positive",
        color: "bg-green-500",
        textColor: "text-green-500",
      };
    } else if (sentiment_value < 0.0) {
      sentimentValue = {
        bgColor: "bg-red-50",
        text: "Positive",
        color: "bg-red-500",
        textColor: "text-red-500",
      };
    } else {
      sentimentValue = {
        bgColor: "bg-gray-50",
        text: "Neutral",
        color: "bg-gray-500",
        textColor: "text-gray-500",
      };
    }

    innerDataHtml += `<div onclick="navigateTo('${
      element.link
    }')" class="hover:scale-[1.04] active:bg-gray-100 transition flex flex-row bg-white rounded-lg shadow-lg overflow-hidden">
          <img src=${element.thumbnail.resolutions[0].url}  class="w-1/4">
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-semibold">${element.title}</h2>
              <div class="flex items-center px-2  ${
                sentimentValue.bgColor
              } rounded-full">
                <span class="inline-block m-2 ${
                  sentimentValue.color
                } rounded-full w-2 h-2"></span>
                <span class="text-sm font-medium ${sentimentValue.textColor}">${
      sentimentValue.text
    }</span>
              </div>
            </div>
            <div class="flex items-center text-gray-500 text-sm mb-2">
              <span>${element.publisher}</span>
              <span class="mx-2">•</span>
              <span>${formattedDate}</span>
            </div>
            <div id="company_tags" class="flex flex-wrap">
            ${
              element.related_companies &&
              element.related_companies
                .map((tag) => {
                  if (tag !== undefined) {
                    return `<span class="text-xs bg-gray-200 rounded-full px-2 py-1 mr-2 mb-2">${tag}</span>`;
                  }
                })
                .join("")
            }
              
            </div>
          </div>
        </div>`;
  });
  document.getElementById("news").innerHTML = innerDataHtml;
};
