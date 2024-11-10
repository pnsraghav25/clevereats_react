import React, { useState, useEffect } from 'react';

const VQA = (props) => {
    const [display, setDisplay] = useState(true);
    const [name, setName] = useState('');
    const [status, setStatus] = useState('');
    const [results, setResults] = useState([]);
    const [selectedFoodId, setSelectedFoodId] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [finalResponse, setFinalResponse] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleViewDetail = (foodId) => {
        if (loading) return;
        setSelectedFoodId(foodId);
        setLoading(true);
        setTimeout(() => {
            setShowModal(true);
            details();
            setLoading(false);
        }, 100);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedFoodId(null);
        setFinalResponse([]);
    };

    const replace = (e) => {
        e = e.toLowerCase();
        e = e[0].toUpperCase() + e.slice(1);
        return e.replaceAll('_', ' ');
    };

    const call = () => {
        setName(props.brand);
        if (name) {
            setStatus('Getting results, please wait...');
            fetch(
                `https://api.edamam.com/api/food-database/v2/parser?app_id=5a62c25f&app_key=d3784bbd33ff5dbf82bf4e262240870a&brand=${name}`
            )
                .then((response) => response.json())
                .then((data) => {
                    const response = data.hints;
                    setResults([]);
                    if (response.length === 0) {
                        setStatus('No results found. Try something like Oreo');
                        return;
                    }
                    setStatus(`Results for ${name}`);
                    setResults(
                        response.map((e, i) => (
                            <div className="w-72 bg-white shadow-md rounded-xl duration-5000 hover:shadow-xl hover:cursor-pointer" key={i}>
                                <div className="w-72 px-4 py-3">
                                    <span className="text-lg font-bold text-black block capitalize mb-3 truncate">{e.food.label}</span>
                                    <span className="text-sm font-semibold text-gray-600 block capitalize mb-3">{(e.food.brand).toLowerCase()}</span>
                                    <div className="flex flex-row items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">Carbohydrates</span>
                                        <span className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.CHOCDF).toFixed(3)}</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">Calories</span>
                                        <span className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.ENERC_KCAL).toFixed(3)}</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">Fat</span>
                                        <span className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.FAT).toFixed(3)}</span>
                                    </div>
                                    <div className="flex flex-row items-center justify-between">
                                        <span className="text-base font-semibold text-black my-1">Fiber</span>
                                        <span className="text-base font-semibold text-black my-1">{Number(e.food.nutrients.FIBTG).toFixed(3)}</span>
                                    </div>
                                    <div className="items-center my-2 self-end">
                                        <button className="bg-indigo-500 shadow-lg shadow-indigo-500/50 py-2 text-center justify-center items-center rounded-lg px-4" onClick={() => handleViewDetail(e.food.foodId)}>
                                            <span className="font-semibold text-sm text-white">View in detail</span>
                                        </button>
                                    </div>
                            </div>
                        </div>
                        ))
                    );
                })
                .catch((err) => {
                    setStatus('No data found');
                    console.log(err);
                });
        }
    };

    const details = async () => {
        const url = 'https://api.edamam.com/api/food-database/v2/nutrients?app_id=5a62c25f&app_key=d3784bbd33ff5dbf82bf4e262240870a';
        const data = JSON.stringify({
            ingredients: [
                {
                    quantity: 1,
                    measureURI: 'http://www.edamam.com/ontologies/edamam.owl#Measure_serving',
                    foodId: selectedFoodId,
                },
            ],
        });
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: data,
        })
            .then((response) => response.json())
            .then((response) => {
                setFinalResponse(
                    <div className='flex flex-col justify-start items-start w-96'>
                        <h2 className="text-left text-lg font-semibold truncate w-11/12">{response.ingredients[0].parsed[0].food}</h2>
                        <div className="flex flex-col items-center justify-between px-4 mt-4">
                            <h3 className="text-left text-base font-bold underline">Caution Labels</h3>
                            <ul className="flex-col gap-2 justify-start mb-2">
                                {response.cautions.map((e, i) => (
                                    <li key={i} className="text-base font-semibold text-red-500">
                                        {replace(e)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex-col items-center justify-between px-4 mt-4">
                            <h3 className="text-left text-base font-bold underline">Nutrition Claims</h3>
                            <ul className="flex-col gap-2 justify-start mb-2 ml-4">
                                {response.healthLabels.map((e, i) => (
                                    <li className="text-base font-semibold text-green-500" key={i}>
                                        {replace(e)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );
                setLoading(false);
            })
            .catch((err) => {
                console.error('There was a problem with the fetch operation:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (selectedFoodId !== null) {
            setLoading(true);
            setTimeout(details, 2000);
        }
    }, [selectedFoodId]);

    return (
        <>
            {display && (
                <div className="items-center mt-12">
                    <button className="bg-indigo-500 text-white py-2 text-center justify-center items-center rounded-lg w-fit px-10 font-semibold text-sm  shadow-lg shadow-indigo-500/50" onClick={call}>
                        Search
                    </button>
                </div>
            )}
            <div>
                <h3 className='my-8 text-center font-semibold text-lg'>{status}</h3>
            </div>
            <div className='grid grid-cols-3 justify-center my-12 gap-8'>{results}</div>

            {/* Modal */}
            {showModal && (
                    <div className="flex justify-center items-center fixed inset-0 bg-black/50 px-5">
                        <div className="bg-white p-6 rounded-lg w-80">
                            <span className="text-xl font-bold mb-4">Detailed Analysis</span>
                            <div className="overflow-y-auto max-h-80 h-fit">
                                {finalResponse}
                            </div>
                            <button className="bg-indigo-100 px-4 py-2 border border-black/50 rounded-lg text-indigo-500 mt-4 self-end" onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
        </>
    );
};

export default VQA;
