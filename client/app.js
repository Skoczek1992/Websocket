'use strict ';

{
  let userName = '';
  const socket = io();
  const loginForm = document.querySelector('#welcome-form');
  const messagesSection = document.querySelector('#messages-section');
  const messagesList = document.getElementById('messages-list');
  const addMessageForm = document.querySelector('#add-messages-form');
  const userNameInput = document.querySelector('#username');
  const messageContentInput = document.querySelector('#message-content');

  messagesSection.classList.remove('show');

  socket.on('message', ({ author, content }) => addMessage(author, content));
  socket.on('join', user =>
    addMessage('Server', `<i><b>${user}</b> has just logged in</i>`)
  );
  socket.on('leave', user =>
    addMessage('Server', `<i><b>${user}</b> has just left</i>`)
  );

  socket.emit('message', {
    author: 'Chat Bot',
    content: 'New user has joined the conversation!',
  });

  const login = function(e) {
    e.preventDefault();
    if (!userNameInput.value) {
      alert('Please enter User Name o_O');
    } else {
      userName = userNameInput.value;
      socket.emit('join', userName);
      addFormClass();
    }
  };

  const sendMessage = function(e) {
    e.preventDefault();
    if (!messageContentInput.value) {
      alert('Please enter message o_O');
    } else {
      addMessage(userName, messageContentInput.value);
      socket.emit('message', {
        author: userName,
        content: messageContentInput.value,
      });
      messageContentInput.value = '';
    }
  };

  const addFormClass = function() {
    if (messagesList.classList.contains('show') && !userNameInput.value) {
      userNameInput.classList.add('show');
    } else {
      messagesSection.classList.add('show');
      loginForm.classList.remove('show');
    }
  };

  const addMessage = function(author, content) {
    const htmlContent = document.createElement('li');
    htmlContent.classList.add('message', 'message--received');
    if (author === userName) {
      htmlContent.classList.add('message--self');
    }
    htmlContent.innerHTML = `<h3 class='message__author'>${
      userName === author ? 'You' : author
    }</h3>
  <div class='message__content'>${content}</div>`;
    messagesList.appendChild(htmlContent);
  };

  loginForm.addEventListener('submit', function(e) {
    login(e);
  });

  addMessageForm.addEventListener('submit', function(e) {
    sendMessage(e);
  });
}
