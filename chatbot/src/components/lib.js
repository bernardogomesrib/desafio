const fetchChats = async (setData) => {
    fetch('http://localhost:8000/chats')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching Chats:', error));
}
const fetchMessagesFromChat = async (id, setMessages) => {
    fetch(`http://localhost:8000/chats/${id}/messages`)
      .then(response => response.json())
      .then(data => setMessages(data))
      .catch(error => console.error('Error fetching messages:', error));
}
const sendMessageToChat = async (id, message, messages, setMessages,setButtons) => {
    const tempMessageId = 'MyTemporaryMessage';
    const botTempMessageId = 'BotTemporaryMessage';
    setMessages(prevMessages => [...prevMessages, { message, isMyMessage: true, id: tempMessageId }]);
    setMessages(prevMessages => [...prevMessages, { message: '...', isMyMessage: false, id: botTempMessageId }]);
    const response = await fetch(`http://localhost:8000/chats/${id}/messages`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        console.error('Error sending message:', response.statusText);
        return;
    }
    if(messages.length === 0){
        await fetchChats(setButtons);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let receivedMessage = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        receivedMessage += decoder.decode(value, { stream: true });

        // eslint-disable-next-line no-loop-func
        setMessages(prevMessages => prevMessages.map(msg =>
            msg.id === botTempMessageId ? { ...msg, message: receivedMessage, isMyMessage: false } : msg
        ));
    }
    await fetchMessagesFromChat(id,setMessages);

}

const newChat = async (name, setButtons,actionsAfterfetchChat) => {
    fetch('http://localhost:8000/chats', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name }),
    })
        .then(response => response.json()).then(
            data => {
                console.log(data);
                fetchChats(setButtons);
                actionsAfterfetchChat(data._id);
            }
        )
        .catch(error => console.error('Error creating chat:', error));
}
export { fetchChats, fetchMessagesFromChat, newChat, sendMessageToChat };

