body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
}

header {
    text-align: center;
    padding: 20px;
    background-color: #333;
    color: white;
}

#design-tool, #inspiration {
    padding: 20px;
    text-align: center;
}

#controls {
    margin-bottom: 10px;
}

#controls button {
    padding: 10px 20px;
    margin: 0 5px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

#controls button:hover {
    background-color: #0056b3;
}

#canvas-container {
    width: 800px;
    height: 400px;
    margin: 0 auto;
    border: 1px solid #ccc;
}

.gallery {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.gallery-item {
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.gallery-item img {
    width: 300px;
    height: 200px;
    object-fit: cover;
}

.gallery-item p {
    margin: 5px 0;
}
