import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CrudProject() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setIsLoading(true);

        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
            setData(response.data.slice(0, 9));
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleInputChange = (event) => {
        setNewItem(event.target.value);
    };

    const handleAddItem = async () => {
        setIsLoading(true);

        try {
            const response = await axios.post('https://jsonplaceholder.typicode.com/todos', {
                title: newItem,
                completed: false,
            });
            setData([...data, response.data]);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }

        setNewItem('');
    };

    const handleUpdateItem = async (id, updatedItem) => {
        setIsLoading(true);

        try {
            const response = await axios.put(`https://jsonplaceholder.typicode.com/todos/${id}`, {
                ...updatedItem,
                id,
            });
            const updatedData = data.map((item) => (item.id === id ? response.data : item));
            setData(updatedData);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    const handleDeleteItem = async (id) => {
        setIsLoading(true);

        try {
            await axios.delete(`https://jsonplaceholder.typicode.com/todos/${id}`);
            const updatedData = data.filter((item) => item.id !== id);
            setData(updatedData);
            setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>CRUD Project</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>
                        <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={(event) =>
                                handleUpdateItem(item.id, {
                                    title: item.title,
                                    completed: event.target.checked,
                                })
                            }
                        />
                        <span>{item.title}</span>
                        <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                    </li>
                ))}
            </ul>
            <input type="text" value={newItem} onChange={handleInputChange} />
            <button onClick={handleAddItem}>Add</button>
        </div>
    );
}

export default CrudProject;
