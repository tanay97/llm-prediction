# LLM Token Predictor

This project provides a simple web interface to interactively explore token predictions and probabilities from an OpenAI language model. It consists of a FastAPI backend and a React frontend.

---

## Features
- Enter a prompt and see the model's top predicted token sequences and their probabilities.
- Adjust the temperature parameter with a slider to see how randomness affects predictions.

---

## Prerequisites
- Python 3.8+
- Node.js (v16+ recommended)
- [uv](https://github.com/astral-sh/uv) (for fast Python dependency management)
- An OpenAI API key

---

## Backend (FastAPI)

### 1. Setup
```bash
cd <project-root>
uv venv
source .venv/bin/activate
uv pip install .
```

### 2. Environment Variables
Create a `.env` file in the project root with **all three variables**:
```env
OPENAI_API_KEY=sk-...
CLIENT_PORT=3000
BACKEND_PORT=8000
```

### 3. Run the Backend
```bash
python main.py
```

---

## Frontend (React)

### 1. Setup
```bash
cd client
npm install
```

### 3. Run the Frontend
```bash
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000) (or your chosen CLIENT_PORT).

---

## Usage
- Enter a prompt in the input box.
- Adjust the temperature slider to see how predictions change.
- The top predicted output and other likely completions will be displayed with their probabilities.

Example:
https://github.com/user-attachments/assets/ff64a064-a66b-47dc-a400-7f2970e82c86


---

## Notes
- Make sure both backend and frontend ports match the values in your `.env` files.
- The backend must be running for the frontend to fetch predictions.
- Requires a valid OpenAI API key with access to the `gpt-3.5-turbo-instruct` model.

---

## License
MIT
