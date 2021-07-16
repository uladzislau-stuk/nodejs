const generateMessage = ({
  id,
  username,
  text,
}) => ({
  id,
  username,
  text,
  createdAt: new Date().getTime()
})

const generateLocationMessage = ({
  id,
  username,
  url,
}) => ({
  id,
  username,
  url,
  createdAt: new Date().getTime()
})


module.exports = {
  generateMessage,
  generateLocationMessage
}
