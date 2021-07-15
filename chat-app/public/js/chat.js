const socket = io()

// Acknowledgments
// server (emit) -> client (receiver) --acknowledgement sever
// client (emit) -> server (receiver) --acknowledgement client

// Elements
const messageForm = document.getElementById('message-form')
const sendLocationButton = document.getElementById('send-location')
const messageInput = document.getElementById('message')
const messages = document.getElementById('messages')
const sidebar = document.getElementById('sidebar')

// Templates
const messageTemplate = document.getElementById('message-template').innerText
const locationMessageTemplate = document.getElementById('location-message-template').innerText
const sidebarTemplate = document.getElementById('sidebar-template').innerText

// Query options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
  // New message element
  const newMessage = messages.lastElementChild
  
  // Height of the new message
  const newMessageStyles = getComputedStyle(newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin
  
  // Visible height
  const visibleHeight = messages.offsetHeight
  
  // Height of messages container
  const containerHeight = messages.scrollHeight
  
  // How far have I scrolled?
  const scrollOffset = messages.scrollTop + visibleHeight
  
  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight
  }
}

socket.on('message', (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('locationMessage', (message) => {
  const html = Mustache.render(locationMessageTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format('h:mm a')
  })
  messages.insertAdjacentHTML('beforeend', html)
  autoscroll()
})

socket.on('roomData', ({room, users}) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users
  })
  sidebar.innerHTML = html
})

messageForm.addEventListener('submit', (e) => {
  e.preventDefault()
  
  const val = messageInput.value
  messageInput.value = ''
  messageInput.focus()
  
  socket.emit('sendMessage', val, (error) => {
    if (error) {
      return alert(error)
    }
  })
})

sendLocationButton.addEventListener('click', () => {
  if(!navigator.geolocation) {
    return alert('Geolocation is not supported by your browser');
  }
  
  // sendLocationButton.disabled = true
  sendLocationButton.setAttribute('disabled', 'disabled')
  
  const success = (position) => {
    socket.emit('sendLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }, (message) => {
      // sendLocationButton.disabled = false
      sendLocationButton.removeAttribute('disabled')
      console.log(message)
    })
  }
  
  const error = () => {
    sendLocationButton.removeAttribute('disabled')
    console.log('Unable to retrieve your location');
  }
  
  navigator.geolocation.getCurrentPosition(success, error);
})

socket.emit('join', {username, room}, (error) => {
  if (error) {
    alert(error)
    location.href = '/'
  }
})
