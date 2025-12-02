
document.addEventListener('DOMContentLoaded', ()=> {
    const toggle = document.getElementById('mobile-toggle')
    const nav = document.getElementById('nav')
    
    toggle?.addEventListener('click', ()=> {
        nav?.classList.toggle('active')
    })
    
    
    const closePromoBtn = document.getElementById('closePromo')
    closePromoBtn.addEventListener('click', b => {
        closePromoBtn.parentElement.parentElement.style.transform = 'scale(0)'
        closePromoBtn.parentElement.parentElement.style.opacity = '0'
        setTimeout(() => {
            closePromoBtn.parentElement.parentElement.remove()
        }, 300);
    });
})