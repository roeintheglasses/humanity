console.log('Client side javascript loaded!!')
const socket = io()

socket.on('humansCountUpdated', (humansCount) => {
    console.log('The human count has been updated!', humansCount)
})

socket.on('aliensCountUpdated', (aliensCount) => {
    console.log('The alien count has been updated!', aliensCount)
})

document.querySelector('#humans').addEventListener('click', () => {
    socket.emit('humansIncrement')
})
document.querySelector('#aliens').addEventListener('click', () => {
    socket.emit('aliensIncrement')
})