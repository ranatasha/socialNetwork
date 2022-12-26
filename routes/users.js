import express from 'express';
import fs from 'fs';
const usersFile = './data/users.json';
const postsFile = './data/posts.json';

let users = JSON.parse(fs.readFileSync(usersFile));
let news = JSON.parse(fs.readFileSync(postsFile));
let router = express.Router();

router.get('/', (req, res) => {
    console.log('Загружаю пользователей...')
    console.log(users)
    res.render('users', { users });
});
router.get('/:id', (req, res)=>{
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if(!user)
        res.status(404).send("Not Found. An user with this ID doesn't exist")
    else{
        res.json({user})
        console.log(`Получаю инфо о пользователе с id:${req.params.id}...`)
    }
})

router.get('/:id/friends', (req, res)=>{
    console.log(`Загружаю друзей пользователя с id:${req.params.id}...`)
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if(!user)
        res.status(404).send("Not Found. An user with this ID doesn't exist")
    else {
        const friendsIDArr = user.friends
        let friends = []
        users.forEach(function(elem){
            if (friendsIDArr.indexOf(parseInt(elem.id)) !== -1)
                friends.push(elem)
        })
        res.render('friends', { friends, user });
    }
})

router.get(`/:id/feed`, (req, res)=>{
    console.log(`Загружаю новости друзей пользователя с id:${req.params.id}...`)
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if(!user)
        res.status(404).send("Not Found. An user with this ID doesn't exist")
    else {
        const friendsIDArr = user.friends
        let friends = []
        users.forEach(function(elem){
            if (friendsIDArr.indexOf(parseInt(elem.id)) !== -1)
                friends.push(elem)
        })
        let posts = []
        news.forEach(function(elem){
            if (friendsIDArr.indexOf(parseInt(elem.userID)) !== -1)
                posts.push(elem)
        })
        console.log(friends)
        res.render('news', { posts, user, friends});
    }
})
router.put('/:id', (req, res)=>{
    let { id, name, birthDate, email, role, status } = req.body
    res.sendStatus(200)
    let user = users.find((el)=> el.id === parseInt(id))
    user.id = parseInt(id)
    user.name = name
    user.birthDate = birthDate
    user.email = email
    user.role = role
    user.status = status
    console.log(`Редактирую книгу с id: ${id}...`)
})
router.delete('/:id', (req, res)=>{
    const user = users.find((user) => user.id === parseInt(req.params.id));
    if(!user)
        res.status(404).send("Not Found. An user with this ID doesn't exist")
    let indexOfDeleted;
    users.forEach((user, index)=> {
        if(parseInt(user.id) === parseInt(req.params.id)) {
            indexOfDeleted = index
        }
    })
    users.splice(indexOfDeleted, 1)
    //удаляем этого юзера из списка друзей у всех пользователей
    users.forEach(function(elem){
        let friends = elem.friends
        let ind = friends.indexOf(parseInt(req.params.id))
        if (ind !== -1)  //если такой друг есть
            friends.splice(ind, 1)
    })
    res.json({users, indexOfDeleted})
    console.log(`Удалил пользователя с id:${req.params.id}.`)

})

export default router;