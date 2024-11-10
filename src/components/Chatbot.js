import React, { useReducer, useState } from 'react';

const initialState = {
    messages: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'ADD_USER_MESSAGE':
            return { messages: [...state.messages, { text: action.payload, sender: 'user' }] };
        case 'ADD_BOT_MESSAGE':
            return { messages: [...state.messages, { text: action.payload, sender: 'bot' }] };
        default:
            return state;
    }
};

const Chatbot = () => {
    const [inputText, setInputText] = useState('');
    const [state, dispatch] = useReducer(reducer, initialState);

    const handleSendMessage = () => {
        if (inputText.trim() !== '') {
            dispatch({ type: 'ADD_USER_MESSAGE', payload: inputText });

            fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=5a62c25f&app_key=d3784bbd33ff5dbf82bf4e262240870a&brand=${inputText}`)
                .then(response => response.json())
                .then(response => {
                    if (response.hints.length === 0) {
                        dispatch({
                            type: 'ADD_BOT_MESSAGE',
                            payload: (
                                <div className="w-fit bg-white shadow-md rounded-xl">
                                    <div className="px-4 py-3">
                                        <span className="text-sm font-bold text-black">
                                            No results found. Try something else.
                                        </span>
                                    </div>
                                </div>
                            ),
                        });
                    } else {
                        const food = response.hints[0].food;
                        const nutrients = food.nutrients;

                        const newOutputText = (
                            <div className="w-72 bg-white shadow-md rounded-xl">
                                <div className="px-4 py-3">
                                    <span className="text-lg font-bold text-black block capitalize mb-3">
                                        {food.label}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-600 block capitalize mb-3">
                                        {food.brand}
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">
                                            Carbohydrates
                                        </span>
                                        <span className="text-base font-semibold text-black my-1">
                                            {Number(nutrients.CHOCDF).toFixed(3)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">
                                            Calories
                                        </span>
                                        <span className="text-base font-semibold text-black my-1">
                                            {Number(nutrients.ENERC_KCAL).toFixed(3)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">
                                            Fat
                                        </span>
                                        <span className="text-base font-semibold text-black my-1">
                                            {Number(nutrients.FAT).toFixed(3)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">
                                            Fiber
                                        </span>
                                        <span className="text-base font-semibold text-black my-1">
                                            {Number(nutrients.FIBTG).toFixed(3)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );

                        dispatch({ type: 'ADD_BOT_MESSAGE', payload: newOutputText });
                    }
                })
                .catch(err => {
                    console.error('Error fetching data:', err);
                    dispatch({ type: 'ADD_BOT_MESSAGE', payload: 'Error fetching data. Please try again.' });
                });

            setInputText('');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', scrollbarColor: 'transperent' }} className='px-12'>
            <ul style={{ flexGrow: 1, padding: 20, overflowY: 'auto', listStyleType: 'none' }}>
                {state.messages.map((item, index) => (
                    <li
                        key={index}
                        style={{
                            display: 'flex',
                            justifyContent: item.sender === 'bot' ? 'flex-start' : 'flex-end',
                            margin: 5,
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: item.sender === 'bot' ? '#f0f0f0' : '#7cb342',
                                color: item.sender === 'bot' ? '#000' : '#fff',
                                padding: '10px',
                                borderRadius: '8px',
                                maxWidth: '70%',
                            }}
                        >
                            {item.text}
                        </div>
                    </li>
                ))}
            </ul>
            <div style={{ display: 'flex', padding: 10, borderTop: '1px solid #ccc' }}>
                <input
                    type="text"
                    placeholder="Enter product name..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#4a90e2',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default Chatbot;
