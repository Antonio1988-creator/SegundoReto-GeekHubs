const helpBubble = document.querySelector('.info-bubble');

// We prevent default events from happening
function allowDrop(e){
    e.preventDefault();
}

// DragStart event handler
function handleDragStart(e){
    this.style.opacity = '0.4';

    // Get the product price
    const price = parseFloat(window.getComputedStyle(
        document.querySelector('#' + e.target.id),
        ':after'
    )
        .getPropertyValue('content')
        // We clean the output from unnecessary characters
        .replaceAll('\"', '')
        .replace('€', '')
    );

    e.dataTransfer.setData('name', e.target.id);
    e.dataTransfer.setData('price', price);

    // Activate help bubble
    helpBubble.style.opacity = 1;
}

// DragEnd event handler
function handleDragEnd(e){
    this.style.opacity = '1';

    // Deactivate help bubble
    helpBubble.style.opacity = 0;
}