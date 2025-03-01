// Конфігурація іграшок та предметів
const config = {
    toys: {
        fennec: {
            name: 'Фенек',
            views: {
                front: 'toys/fennec-front.png',
                left: 'toys/fennec-left.png',
                right: 'toys/fennec-right.png',
                back: 'toys/fennec-back.png'
            }
        }
    },
    clothing: [],  // Поки що пустий масив для одягу
    accessories: [] // Поки що пустий масив для аксесуарів
};

// Стан додатку
const state = {
    currentToy: 'fennec',
    currentView: 'front',
    wornItems: new Set()
};

// DOM елементи
const mainToyImage = document.getElementById('mainToyImage');
const clothingContainer = document.getElementById('clothingContainer');

// Оновлення вигляду іграшки
function updateToyView() {
    const currentToy = config.toys[state.currentToy];
    const newSrc = currentToy.views[state.currentView];
    console.log('Оновлення вигляду:', {
        поточний_вигляд: state.currentView,
        новий_шлях: newSrc,
        поточний_шлях: mainToyImage.src
    });
    
    mainToyImage.src = newSrc;
    mainToyImage.alt = currentToy.name;
}

// Ініціалізація інтерфейсу
function initializeInterface() {
    // Обробники подій для кнопок вигляду
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const view = btn.dataset.view;
            console.log('Натиснута кнопка:', {
                вигляд: view,
                поточний: state.currentView
            });
            
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentView = view;
            updateToyView();
        });
    });
}

// Ініціалізуємо інтерфейс при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    console.log('Сторінка завантажена');
    initializeInterface();
    updateToyView();
});