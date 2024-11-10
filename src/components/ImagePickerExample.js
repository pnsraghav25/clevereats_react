import React, { useState } from 'react';
import { storage } from '../config'; // Import the updated Firebase storage
import axios from 'axios';  // Import axios for API calls
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage methods
import VQA from './VQA';

const ImagePickerExample = () => {
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState(null);
    const [data, setData] = useState('');

    // Handle file input change (image selection)
    const handleImageChange = async (event) => {
        setData("");
        setStatus(null);
        const file = event.target.files[0];
        if (file) {
        const imageUrl = URL.createObjectURL(file);  // To preview the image
        setImage(imageUrl);
        }
    };

    // Upload image to Firebase Storage
    const uploadMedia = async () => {
        setData('Your photo is uploading...');
        setUploading(true);
        setResponse("");
        try {
        // Get the selected file from the file input
        const file = document.querySelector('input[type="file"]').files[0];

        if (file) {
            // Create a storage reference
            const storageRef = ref(storage, 'uploads/' + file.name);  // You can modify the path

            // Upload the file to Firebase Storage
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            console.log('File uploaded successfully: ', url);
            
            // Call the image captioning API with the image URL
            query(url);
        }
        } catch (error) {
        console.error('Error uploading file: ', error);
        }
    };

    // Query image captioning API
    const query = async (url) => {
        setData("Photo upload successful, image is being analyzed...");
        try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large",
            { url },
            {
            headers: {
                Authorization: "Bearer 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", // Replace with your Hugging Face API key
            },
            }
        );

        const generatedText = response.data[0]?.generated_text;
        if (generatedText) {
            setResponse(generatedText);
            setStatus(true);
            setData("Click the button below for more details");
        } else {
            throw new Error("Error in API response");
        }
        } catch (error) {
        console.error('Error querying API: ', error);
        setUploading(false);
        alert("An error occurred. Please try again.");
        }
    };

  // Search for recognized items in the generated text
    function findItems(text) {
            const items = ["Oreo", "Lays", "Coca Cola"];
            const itemsLowercase = items.map(item => item.toLowerCase());
            const textLowercase = text.toLowerCase();
            const foundItems = [];

            itemsLowercase.forEach(item => {
            if (textLowercase.includes(item)) {
                foundItems.push(item);
            }
            });

            return foundItems.length ? foundItems[0] : null;
    }

    return (
            <div className='flex flex-col justify-center items-center'>
            <div className='mt-24 font-semibold text-sm bg-indigo-400/10 border border-indigo-100 py-2 text-center justify-center items-center rounded-lg w-fit px-10'>
                <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                />
                <button onClick={uploadMedia} disabled={!image || uploading} className='hover:cursor-pointer font-semibold text-sm bg-indigo-800/10 border border-indigo-400 py-2 text-center justify-center items-center rounded-lg w-fit px-10'>
                Upload Image
                </button>
            </div>
            <div className='justify-center items-center mt-12'>
                {image && <img src={image} alt="Selected" style={{ width: '300px', height: '300px', marginBottom: '12px' }} />}
            </div>
            {uploading && <p className="upload-status">{data}</p>}
            {status && response && (
                <div>
                <p>Identified Brand: {findItems(response)}</p>
                </div>
            )}
            {status && <VQA brand={findItems(response)} />}
            </div>
    );
};

export default ImagePickerExample;
