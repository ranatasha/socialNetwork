document.addEventListener('DOMContentLoaded', function() {
    const userID = document.getElementById('id')
    userID.parentElement.style.display='none'
    document.addEventListener('keydown', function(event) {
        const key = event.key;
        const modalWindow = document.getElementById('modal-window');
        const modalRemove = document.getElementById('modal-remove')
        const validationError = document.getElementById('validation-error')
        if (key === "Escape") {
            modalWindow.style.display='none'
            modalRemove.style.display='none'
            validationError.style.display='none'
        }
    })
}, false)
const openRemoveModal = (isFriendsList) => {
    const modalRemove = document.getElementById('modal-remove');
    modalRemove.showModal();
    modalRemove.style.display = "block";
}
const removeUser = () => {
    const selectRemoveID = document.getElementById('select-remove-object').value
    const answer = confirm('Are you sure you want to permanently delete the user from the list? Data will be lost')
    if (answer) {
        fetch(`/users/${selectRemoveID}`, {
            method: 'DELETE'
        })
            .then((res)=>res.json())
            .then(({users, indexOfDeleted})=>{
                const tableRows = document.getElementsByClassName('table-row')
                const removeOptions = document.getElementsByClassName('removeOptions')
                tableRows[indexOfDeleted].remove()
                removeOptions[indexOfDeleted].remove()
                closeModal(document.getElementById('modal-remove'))

                if(users.length === 0) {
                    const tbody = document.getElementsByTagName('tbody')
                    const row = document.createElement('tr')
                    const cell = document.createElement('td')
                    cell.setAttribute('colspan', '6')
                    cell.innerHTML = 'There are no users in the list'
                    cell.style.fontFamily = 'inherit'
                    cell.style.fontFamily = "'Roboto', sans-serif"
                    cell.style.fontWeight = "400"
                    cell.style.fontSize = "16px"
                    row.appendChild(cell)
                    tbody[0].appendChild(row)
                }
            })
        console.log(`Книга с id:${selectRemoveID} удалена`)
    }
    else
        console.log('Удаление отменено')

}
const openModalEvent = (index) => {
    const modalWindow = document.getElementById('modal-window');

     fetch(`/users/${index}`)
         .then((res) => res.json())
         .then(({ user }) => {
             document.getElementById('id').value = user.id
             document.getElementById('name').value = user.name;
             document.getElementById('birthDate').value = user.birthDate;
             document.getElementById('email').value = user.email;
             document.getElementById('role').value = user.role;
             document.getElementById('status').value = user.status;
             console.log(`Инфо о пользователе с id:${index} получена.`)
         })
    modalWindow.showModal();
    modalWindow.style.display = "block";
}

const getEditData = () => {
    const newName = document.getElementById('name').value
    const newBirthdate = document.getElementById('birthDate').value
    const newEmail = document.getElementById('email').value
    const newRole = document.getElementById('role').value
    let newStatus = document.getElementById('status').value
    if (!(newName&&newBirthdate&&newEmail&&newRole&&newStatus)) {
        const validationError = document.getElementById('validation-error')
        validationError.style.display = 'block'
        validationError.style.textAlign ='center'
        validationError.innerHTML='Please, check if the fields are filled. '
        validationError.style.color = 'red'
    }
    else {
        const validationError = document.getElementById('validation-error')
        validationError.style.display = 'none'
        let newUser = {
            id: '',
            name: newName,
            birthDate: newBirthdate,
            email: newEmail,
            role: newRole,
            status: newStatus,
        }
        newUser.id = document.getElementById('id').value,
        editUser(newUser)
    }
}

const editUser = (user) => {
    fetch(`/users/${user.id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify(user)
    })
        .then((res)=>{
            if (res.ok) {
                console.log(`Редактирование книги с id:${user.id} прошло успешно`)
                window.location.href = 'http://localhost:8080/users'
            }

        })
}

const followToFriendsList = () => {
    const userID = document.getElementById('id').value
    window.location.href = `http://localhost:8080/users/${userID}/friends`
}

const followToNews = (userID = document.getElementById('id').value) => {
    window.location.href = `http://localhost:8080/users/${userID}/feed`
}

const closeModal = (el) => {
    el.closest('dialog').close();
    const modalWindow = document.getElementById('modal-window');
    const modalRemove = document.getElementById('modal-remove');
    modalWindow.style.display = "none";
    modalRemove.style.display ='none';
}
