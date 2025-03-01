// Конфігурація іграшок та предметів
const config = {
    toys: {
        fennec: {
            name: 'Фенек',
            views: {
                front: '/toy-customizer/toys/fennec-front.png',
                left: '/toy-customizer/toys/fennec-left.png',
                right: '/toy-customizer/toys/fennec-right.png',
                back: '/toy-customizer/toys/fennec-back.png'
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
    activeClothing: [],
    activeAccessories: []
};

// Оновлення вигляду іграшки
function updateToyView() {
    const currentToy = config.toys[state.currentToy];
    const newSrc = currentToy.views[state.currentView];
    console.log('Оновлення вигляду:', {
        поточний_вигляд: state.currentView,
        новий_шлях: newSrc
    });
    
    // Додаємо обробку помилок завантаження зображення
    const mainToyImage = document.getElementById('mainToyImage');
    mainToyImage.onerror = function() {
        console.error('Помилка завантаження зображення:', newSrc);
    };
    
    mainToyImage.src = newSrc;
    mainToyImage.alt = currentToy.name;
}

// Ініціалізація інтерфейсу
function initializeInterface() {
    // Обробка кнопок перегляду
    document.querySelectorAll('.view-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Видаляємо активний клас з усіх кнопок
            document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
            // Додаємо активний клас до натиснутої кнопки
            this.classList.add('active');
            
            // Оновлюємо стан і вигляд
            state.currentView = this.dataset.view;
            updateToyView();
        });
    });

    // Обробка кнопок іграшок
    document.querySelectorAll('.toy-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Видаляємо активний клас з усіх кнопок
            document.querySelectorAll('.toy-btn').forEach(btn => btn.classList.remove('active'));
            // Додаємо активний клас до натиснутої кнопки
            this.classList.add('active');
            
            // Оновлюємо стан і вигляд
            state.currentToy = this.dataset.toy;
            updateToyView();
        });
    });

    // Оновлюємо початковий вигляд
    updateToyView();
}

// Ініціалізуємо інтерфейс при завантаженні
document.addEventListener('DOMContentLoaded', () => {
    console.log('Сторінка завантажена');
    initializeInterface();
});