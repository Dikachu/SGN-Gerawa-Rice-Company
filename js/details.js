// const reviews = [
//     { name: "Sarah Johnson", date: "Nov 20, 2025", rating: 5, comment: "Excellent quality rice! The grains are long and fluffy. Perfect for special occasions." },
//     { name: "Michael Chen", date: "Nov 18, 2025", rating: 4, comment: "Very good rice, great aroma. Takes a bit longer to cook but worth it." },
//     { name: "Priya Sharma", date: "Nov 15, 2025", rating: 5, comment: "Authentic basmati taste. Reminds me of home. Will definitely order again!" },
//     { name: "David Brown", date: "Nov 10, 2025", rating: 4, comment: "Good value for money. The 5kg bag lasts a while for our family." },
// ];
// function renderStars(rating) {
//     const fullStars = Math.floor(rating);
//     const hasHalfStar = rating % 1 !== 0;
//     let starsHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg>'.repeat(fullStars);
//     if (hasHalfStar)
//         starsHTML += '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.0006 15.968L16.2473 18.3451L15.2988 13.5717L18.8719 10.2674L14.039 9.69434L12.0006 5.27502V15.968ZM12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path></svg>';
//     return starsHTML;
// }
// function loadReviews() {
//     const avgStarsEl = document.getElementById('avgStars');
//     if (avgStarsEl)
//         avgStarsEl.innerHTML = renderStars(4.5);
//     const reviewsList = document.getElementById('reviewsList');
//     if (!reviewsList)
//         return;
//     reviewsList.innerHTML = reviews.map(review => `
//         <div class="review-item">
//             <div class="review-header">
//                 <span class="reviewer-name">${review.name}</span>
//                 <span class="review-date">${review.date}</span>
//             </div>
//             <div class="review-stars">${renderStars(review.rating)}</div>
//             <p class="review-text">${review.comment}</p>
//         </div>
//     `).join('');
// }
document.addEventListener('DOMContentLoaded', () => {
    const qtyInput = document.getElementById('quantity');
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    decreaseBtn?.addEventListener('click', () => {
        const currentQty = parseInt(qtyInput.value);
        if (currentQty > 1)
            qtyInput.value = (currentQty - 1).toString();
    });
    increaseBtn?.addEventListener('click', () => {
        const currentQty = parseInt(qtyInput.value);
        qtyInput.value = (currentQty + 1).toString();
    });

    // Modal functionality
    const modal = document.getElementById('reviewModal');
    const openModalBtn = document.getElementById('writeReviewBtn');

    openModalBtn?.addEventListener('click', () => {
        modal?.classList.add('show');
    });
});


