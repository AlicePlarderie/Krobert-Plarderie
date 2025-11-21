let currentLanguage = 'en';
let data = {};

// Функция для показа/скрытия loader
function showLoader(show = true) {
    const loader = document.getElementById('page-loader');
    const content = document.getElementById('main-content');
    
    if (loader && content) {
        if (show) {
            loader.style.display = 'flex';
            content.style.opacity = '0';
            content.style.visibility = 'hidden';
        } else {
            loader.style.display = 'none';
            content.style.opacity = '1';
            content.style.visibility = 'visible';
        }
    }
}

// Load language data
async function loadLanguage(lang) {
    showLoader(true); // Показываем loader перед загрузкой
    
    try {
        const response = await fetch(`data/${lang}.json`);
        data = await response.json();

        // Обновляем активную кнопку
        const buttons = document.querySelectorAll('.language-switcher button');
        buttons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-lang') === currentLanguage) {
                button.classList.add('active');
            }
        });
        
        // Рендерим страницу
        await renderPage();
        
        // Даем немного времени на отрисовку DOM
        setTimeout(() => {
            showLoader(false); // Скрываем loader после полной загрузки
        }, 500);
        
    } catch (error) {
        console.error('Error loading language:', error);
        showLoader(false); // Все равно скрываем loader при ошибке
    }
}

// Change language
function changeLanguage(lang) {
    currentLanguage = lang;
    document.documentElement.lang = lang;
    loadLanguage(lang);
}

// Render all page content
async function renderPage() {
    // Рендерим все секции
    renderProfile();
    renderServices();
    renderInfo();
    renderContacts();
    
    // Ждем завершения микротасков
    await new Promise(resolve => setTimeout(resolve, 0));
}
function renderContacts() {
    document.getElementById('contacts').textContent = data.meta.language === 'ru' ? 'Контакты' : 'Contacts';
    document.getElementById('tipsbut').textContent = data.meta.language === 'ru' ? 'Дать мне денег ♥' : 'Give me money ♥';
}




// Render profile section
function renderProfile() {
    const profile = data.profile;
    document.getElementById('username').textContent = profile.title;
    document.getElementById('description').textContent = profile.description;
}

// Render services with examples
function renderServices() {
    const servicesHTML = data.services.map(service => {
        const examples = getExampleImages(service.examples);
        
        return `
        <div class="service-card">
            <h2>${service.name}</h2>
            <div class="text2">${service.tat}</div>
            <div class="price">${service.price}</div>
            <p>${service.description}</p>
            
            <div class="examples">
                ${examples.map(example => `
                    <img src="${example}" alt="${service.name} example" class="example-image" onerror="this.style.display='none'">
                `).join('')}
            </div>
        </div>
        `;
    }).join('');
    
    document.getElementById('services-grid').innerHTML = servicesHTML;
}

// Инфа
function renderInfo() {
    const infoHTML = data.info.map(inf => {
        return `
        <div class="info-card">
            <h2>${inf.title}</h2>
            <div class="info-text">${inf.text}</div>
        </div>
        `;
    }).join('');
    
    document.getElementById('infos-grid').innerHTML = infoHTML;
}

function getExampleImages(folderName, maxFiles =5) {
    const images = [];
    
    // Просто генерируем пути, браузер сам покажет только существующие
    for (let i = 1; i <= maxFiles; i++) {
        images.push(`${folderName}/${i}.png`);
    }
    
    return images;
}

// Параллакс для звезд
function initParallax() {
    const starsFar = document.querySelector('.stars-far');
    const starsNear = document.querySelector('.stars-near');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Далёкие звезды двигаются медленнее
        if (starsFar) {
            starsFar.style.transform = `translateY(${scrolled * 0.08}px)`;
        }
        
        // Ближние звезды двигаются быстрее  
        if (starsNear) {
            starsNear.style.transform = `translateY(${scrolled * 0.15}px)`;
        }
    });
}


// Initialize
loadLanguage(currentLanguage); // подгрузка языка
document.addEventListener('DOMContentLoaded', initParallax); // подгрузка звезд