function extractProductData() {
  const title = document.querySelector('h1')?.innerText || 'Не указано';
  const priceEl = document.querySelector('.price-block__final-price');
  const price = priceEl ? priceEl.innerText.replace(/\D/g, '') : '0';
  const rating = parseFloat(document.querySelector('[data-rating]')?.getAttribute('data-rating') || '0');
  const reviewsText = document.querySelector('.product-review__count')?.innerText || '0';
  const reviews = parseInt(reviewsText.replace(/\D/g, ''), 10) || 0;
  const category = [...document.querySelectorAll('.breadcrumbs__item')]
    .map(el => el.innerText.trim())
    .filter(text => text && !['Каталог', 'Главная'].includes(text))
    .join(' > ');

  return { title, price, rating, reviews, category };
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getProduct") {
    sendResponse(extractProductData());
  }
});
