// Конфігурація іграшок та предметів
const config = {
    toys: {
        toy1: {
            name: 'Іграшка 1',
            views: {
                front: 'toys/toy1-front.png',
                side: 'toys/toy1-side.png',
                back: 'toys/toy1-back.png'
            }
        },
        toy2: {
            name: 'Іграшка 2',
            views: {
                front: 'toys/toy2-front.png',
                side: 'toys/toy2-side.png',
                back: 'toys/toy2-back.png'
            }
        }
    },
    clothing: [
        {
            id: 'dress1',
            name: 'Сукня 1',
            image: 'clothes/dress1.png',
            positions: {
                toy1: {
                    front: { top: '30%', left: '30%' },
                    side: { top: '30%', left: '30%' },
                    back: { top: '30%', left: '30%' }
                },
                toy2: {
                    front: { top: '32%', left: '32%' },
                    side: { top: '32%', left: '32%' },
                    back: { top: '32%', left: '32%' }
                }
            }
        },
        // Додайте більше предметів одягу тут
    ],
    accessories: [
        {
            id: 'bow1',
            name: 'Бант 1',
            image: 'accessories/bow1.png',
            positions: {
                toy1: {
                    front: { top: '10%', left: '45%' },
                    side: { top: '10%', left: '45%' },
                    back: { top: '10%', left: '45%' }
                },
                toy2: {
                    front: { top: '12%', left: '47%' },
                    side: { top: '12%', left: '47%' },
                    back: { top: '12%', left: '47%' }
                }
            }
        },
        // Додайте більше аксесуарів тут
    ]
};

// Стан додатку
const state = {
    currentToy: 'toy1',
    currentView: 'front',
    wornItems: new Set(),
    savedDesigns: [] // Збережені дизайни
};

// Завантаження збережених дизайнів при старті
function loadSavedDesigns() {
    const saved = localStorage.getItem('savedDesigns');
    if (saved) {
        state.savedDesigns = JSON.parse(saved);
        updateSavedDesignsView();
    }
}

// Збереження дизайну
function saveCurrentDesign() {
    const design = {
        id: Date.now(),
        toy: state.currentToy,
        items: Array.from(state.wornItems),
        timestamp: new Date().toISOString()
    };
    
    state.savedDesigns.push(design);
    localStorage.setItem('savedDesigns', JSON.stringify(state.savedDesigns));
    
    // Створюємо превью
    html2canvas(document.querySelector('.toy-view')).then(canvas => {
        design.preview = canvas.toDataURL('image/png');
        updateSavedDesignsView();
    });
}

// Оновлення відображення збережених дизайнів
function updateSavedDesignsView() {
    const container = document.getElementById('savedDesigns');
    container.innerHTML = '';
    
    state.savedDesigns.forEach(design => {
        const div = document.createElement('div');
        div.className = 'saved-design';
        if (design.preview) {
            const img = document.createElement('img');
            img.src = design.preview;
            div.appendChild(img);
        }
        div.addEventListener('click', () => loadDesign(design));
        container.appendChild(div);
    });
}

// Завантаження збереженого дизайну
function loadDesign(design) {
    state.currentToy = design.toy;
    state.wornItems = new Set(design.items);
    updateToyView();
    
    // Оновлюємо кнопки вибору іграшки
    document.querySelectorAll('.toy-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.toy === design.toy);
    });
}

// Завантаження зображення
function downloadImage() {
    html2canvas(document.querySelector('.toy-view')).then(canvas => {
        const link = document.createElement('a');
        link.download = `toy-design-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

// Поділитися дизайном
function shareDesign() {
    html2canvas(document.querySelector('.toy-view')).then(canvas => {
        canvas.toBlob(blob => {
            const file = new File([blob], "toy-design.png", { type: "image/png" });
            if (navigator.share) {
                navigator.share({
                    title: 'Мій дизайн іграшки',
                    files: [file]
                }).catch(console.error);
            } else {
                downloadImage(); // Якщо share API не підтримується, просто завантажуємо
            }
        });
    });
}

// DOM елементи
const mainToyImage = document.getElementById('mainToyImage');
const clothingContainer = document.getElementById('clothingContainer');
const clothingItemsGrid = document.getElementById('clothingItems');
const accessoryItemsGrid = document.getElementById('accessoryItems');

// Ініціалізація інтерфейсу
function initializeInterface() {
    // Ініціалізація предметів одягу
    config.clothing.forEach(item => {
        const itemElement = createItemElement(item);
        clothingItemsGrid.appendChild(itemElement);
    });

    // Ініціалізація аксесуарів
    config.accessories.forEach(item => {
        const itemElement = createItemElement(item);
        accessoryItemsGrid.appendChild(itemElement);
    });

    // Обробники подій для кнопок вигляду
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentView = btn.dataset.view;
            updateToyView();
        });
    });

    // Обробники подій для кнопок вибору іграшки
    document.querySelectorAll('.toy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toy-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.currentToy = btn.dataset.toy;
            updateToyView();
        });
    });
    
    loadSavedDesigns(); // Завантажуємо збережені дизайни при старті
}

// Створення елемента предмета
function createItemElement(item) {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div>${item.name}</div>
    `;
    div.addEventListener('click', () => toggleItem(item));
    return div;
}

// Перемикання предмета (одягання/зняття)
function toggleItem(item) {
    if (state.wornItems.has(item.id)) {
        state.wornItems.delete(item.id);
        removeItemFromView(item.id);
    } else {
        state.wornItems.add(item.id);
        addItemToView(item);
    }
}

// Додавання предмета на іграшку
function addItemToView(item) {
    const itemElement = document.createElement('img');
    itemElement.src = item.image;
    itemElement.className = 'clothing-item';
    itemElement.id = `item-${item.id}`;
    
    const position = item.positions[state.currentToy][state.currentView];
    Object.assign(itemElement.style, position);
    
    clothingContainer.appendChild(itemElement);
}

// Видалення предмета з іграшки
function removeItemFromView(itemId) {
    const element = document.getElementById(`item-${itemId}`);
    if (element) {
        element.remove();
    }
}

// Оновлення вигляду іграшки
function updateToyView() {
    // Оновлення основного зображення іграшки
    mainToyImage.src = config.toys[state.currentToy].views[state.currentView];
    
    // Оновлення позицій всіх одягнених предметів
    clothingContainer.innerHTML = '';
    state.wornItems.forEach(itemId => {
        const item = [...config.clothing, ...config.accessories].find(i => i.id === itemId);
        if (item) {
            addItemToView(item);
        }
    });
}

// Додаємо обробники подій для нових кнопок
document.getElementById('saveDesignBtn').addEventListener('click', saveCurrentDesign);
document.getElementById('downloadBtn').addEventListener('click', downloadImage);
document.getElementById('shareBtn').addEventListener('click', shareDesign);

// Запуск додатку
initializeInterface();
