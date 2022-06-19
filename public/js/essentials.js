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

let createPopUp = (text) => {
    let new_popup = document.createElement('div')
    new_popup.classList.add('pop-up', 'hidden')
    new_popup.innerHTML = '<h3>' + text + '</h3>'
        + '<a href="/">play again</a>'
    document.body.appendChild(new_popup)
}
