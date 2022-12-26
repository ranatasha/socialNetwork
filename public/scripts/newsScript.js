document.addEventListener('DOMContentLoaded', function() {
    let authorsID = document.getElementsByClassName('authorID')
    for(let i=0; i<authorsID.length; i++){
        authorsID[i].style.display='none'
    }
    const items = document.getElementsByClassName('news-item')
    if(!items.length){
        let feed = document.getElementsByClassName('news-feed')[0]
        const message = document.createElement('div')
        message.innerHTML = 'There are no new posts from friends'
        message.classList.add('news-item')
        feed.appendChild(message)
    }
})