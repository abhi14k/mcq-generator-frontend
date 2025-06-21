# MCQ Generator Frontend

A simple React application for playing a multiple-choice question (MCQ) game. The app fetches questions from a backend, allows users to select answers, checks correctness, and moves to the next question. Built with React, TypeScript, and [@tanstack/react-query](https://tanstack.com/query/latest).

## Features

- Fetches MCQ questions from a backend API
- Lets users select and submit answers
- Checks if the answer is correct and displays feedback
- Loads the next question on button click
- Minimal, clean UI

## Getting Started

### Prerequisites

- Node.js (v14 or above recommended)
- npm

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/mcq-generator-frontend.git
   cd mcq-generator-frontend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Ensure your backend is running at `http://localhost:8000` and exposes the following endpoints:
   - `POST /generate-mcq`
   - `POST /check-answer`

### Running the App

```sh
npm start
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## API Endpoints

- **POST `/generate-mcq`**
  - Request: _No body_
  - Response:
    ```json
    {
      "id": "string",
      "question": "string",
      "choices": ["string", "string", "string", "string"]
    }
    ```

- **POST `/check-answer`**
  - Request:
    ```json
    {
      "id": "string",
      "answer": "string"
    }
    ```
  - Response:
    ```json
    {
      "correct": true,
      "correct_answer": "string"
    }
    ```

## Tech Stack

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [@tanstack/react-query](https://tanstack.com/query/latest)

## License

MIT
