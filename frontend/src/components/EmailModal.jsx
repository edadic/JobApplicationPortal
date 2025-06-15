import React, { useState } from 'react';

const EmailModal = ({ isOpen, onClose, applicant, jobTitle, onSend }) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen || !applicant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Send Message to {applicant.first_name} {applicant.last_name}</h2>
        <input
          className="border p-2 w-full mb-2"
          placeholder="Subject"
          value={subject}
          onChange={e => setSubject(e.target.value)}
        />
        <textarea
          className="border p-2 w-full mb-4"
          placeholder="Message"
          rows={6}
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            onSend({ subject, message });
            setSubject('');
            setMessage('');
          }}
        >
          Send Email
        </button>
      </div>
    </div>
  );
};

export default EmailModal;