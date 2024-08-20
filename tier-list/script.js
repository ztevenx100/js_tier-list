const $ = el => document.querySelector(el);
const $$ = els => document.querySelectorAll(els);

const imagesInput = $('#images-input');
const itemsSection = $('.selector-items');

let draggedElement = null;
let sourceContainer = null;
const levels = $$('.tier .level');

const handleDrop = (event) => {
    event.preventDefault();
    
    const { currentTarget, dataTransfer } = event;
    
    if(sourceContainer && draggedElement) {
        sourceContainer.removeChild(draggedElement);
    }

    if(draggedElement) {
        const src = dataTransfer.getData('text/plain');
        const imgElement = createItem(src);
        currentTarget.appendChild(imgElement);
    }

    currentTarget.classList.remove('drag-over');
    currentTarget.querySelector('.drag-preview')?.remove();
}

/**
 * Funcion para el momento en el que el objeto arrastrado este sobre el espacio a dejar.
 * @param {Event} event - evento al realizar un drag sobre el item/espacio/seccion arrastrado.
 */
const handleDragOver = (event) => {
    event.preventDefault();
    
    const { currentTarget, dataTransfer } = event;
    if (sourceContainer === currentTarget) return;
    
    currentTarget.classList.add('drag-over');
    
    const dragPreview = $('.drag-preview');

    if(draggedElement && !dragPreview){
        const previewElement = draggedElement.cloneNode(true);
        previewElement.classList.add('drag-preview');
        currentTarget.appendChild(previewElement);
    }
}

/**
 * Funcion para el momento en el que el objeto arrastrado este fuera el espacio a dejar.
 * @param {Event} event - evento al realizar un drag fuera el item/espacio/seccion arrastrado.
 */
const handleDragLeave = (event) => {
    event.preventDefault();
    
    const { currentTarget } = event;
    currentTarget.classList.remove('drag-over');
    currentTarget.querySelector('.drag-preview')?.remove();
}

levels.forEach(level => {
    level.addEventListener('dragover', handleDragOver);
    level.addEventListener('drop', handleDrop);
    level.addEventListener('dragleave', handleDragLeave);
})

itemsSection.addEventListener('dragover', handleDragOver);
itemsSection.addEventListener('drop', handleDrop);
itemsSection.addEventListener('dragleave', handleDragLeave);

const handleDragStart = (event) => {
    draggedElement = event.target;
    sourceContainer = draggedElement.parentNode;
    event.dataTransfer.setData('text/plain', draggedElement.src);
}

const handleDragEnd = (event) => {
    draggedElement = null;
    sourceContainer = null;
}

const createItem = (src) =>{
    const imgElement = document.createElement('img');
    imgElement.src = src;
    imgElement.className = 'item-image';
    
    imgElement.draggable = true;
    imgElement.addEventListener('dragstart', handleDragStart);
    imgElement.addEventListener('dragend', handleDragEnd);
    
    itemsSection.appendChild(imgElement);
    return imgElement;
}

const useFilesToCreateItems = (files) => {
    if(files && files.length > 0){
        Array.from(files).forEach(file => {
            const reader = new FileReader();
    
            reader.onload = (eventReader) => {
                createItem(eventReader.target.result);
            }
    
            reader.readAsDataURL(file);
        })
    }
}

imagesInput,addEventListener('change', (event) => {
    const { files } = event.target;
    useFilesToCreateItems(files);
})
