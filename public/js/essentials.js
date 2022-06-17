let options_button = document.querySelector('.options')
let pop_up = document.querySelector('.pop-up')

options_button.addEventListener('click', evt => {
    options_button.setAttribute('data-active',
        options_button.getAttribute('data-active') === 'true' ? 'false' : 'true')
    if (options_button.getAttribute('data-active') === 'true')
        pop_up.classList.remove('hidden')
    else
        pop_up.classList.add('hidden')

})