const MessageItem = ({ message, currentUser }) => {
  // Détermination si le message a été envoyé par l'utilisateur actuel
  const isOwnMessage = message.sender_id === currentUser.id;

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`max-w-[70%] p-3 rounded-lg ${isOwnMessage ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-black rounded-bl-none'}`}>
        <p>{message.text}</p>
        <div className="flex items-center justify-end mt-1">
          <span className="text-[10px] opacity-70">
            {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {/* Optionnel: indicateur de livraison pour les messages envoyés par l'utilisateur */}
          {isOwnMessage && (
            <span className="ml-1 text-[10px]">
              {message.delivered ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
