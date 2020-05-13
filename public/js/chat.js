console.log('chat javascript loaded!!')
const socket = io()

socket.on('humansCountUpdated', (humansCount) => {
    console.log('The human count has been updated!', humansCount)
    document.querySelector('#humans-progress-bar').value = humansCount;
})

socket.on('aliensCountUpdated', (aliensCount) => {
    console.log('The alien count has been updated!', aliensCount)
    document.querySelector('#aliens-progress-bar').value = aliensCount;


})

document.querySelector('#humansButton').addEventListener('click', () => {
    socket.emit('humansIncrement')

})
document.querySelector('#aliensButton').addEventListener('click', () => {
    socket.emit('aliensIncrement')
})