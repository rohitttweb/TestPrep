import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const chatboxRef = useRef(null);
    const API_BASE_URL = process.env.API_URL || "http://localhost:3001";

    const formatText = (text) => {
        const boldRegex = /\*\*(.*?)\*\*/g;
        text = text.replace(boldRegex, "<strong>$1</strong>");

        const italicRegex = /\*(.*?)\*/g;
        text = text.replace(italicRegex, "<em>$1</em>");

        text = text.replace(/\n/g, "<br />");

        const bulletPointRegex = /^([*-])\s+(.*)$/gm;
        text = text.replace(bulletPointRegex, "<ul><li>$2</li></ul>");

        const headerRegex = /^(#{1,6})\s*(.*?)$/gm;
        text = text.replace(headerRegex, (match, hashes, headerText) => {
            const level = hashes.length;
            return `<h${level}>${headerText}</h${level}>`;
        });

        const blockquoteRegex = /^>\s+(.*)$/gm;
        text = text.replace(blockquoteRegex, "<blockquote>$1</blockquote>");

        return text;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const newMessages = [...messages, { role: "user", content: input }];
        setMessages(newMessages);
        setInput("");

        try {
            const response = await axios.post(`${API_BASE_URL}/api/ai/chat`, { messages: newMessages });
            setMessages([...newMessages, response.data.choices[0].message]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn btn-primary btn-circle shadow-lg"
            >
                💬
            </button>

            {isOpen && (
                <div ref={chatboxRef} className="fixed bottom-20 right-4 md:right-6 w-80 md:w-96 bg-white border rounded-lg shadow-xl flex flex-col">
                    <div className="bg-primary text-white p-3 flex justify-between items-center rounded-t-lg">
                        <span>Chatbot</span>
                        <button onClick={() => setIsOpen(false)} className="btn btn-sm btn-circle">✖</button>
                    </div>

                    <div className="h-80 max-h-[60vh] overflow-y-auto p-3 space-y-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}>
                                <div className="chat-bubble" dangerouslySetInnerHTML={{ __html: formatText(msg.content) }} />
                            </div>
                        ))}
                    </div>

                    <div className="p-3 border-t flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type a message..."
                            className="input input-bordered flex-1 text-sm md:text-base p-2 md:p-3"
                        />
                        <button onClick={sendMessage} className="btn btn-primary whitespace-nowrap text-sm md:text-base px-3 md:px-4 py-2 md:py-3">Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
