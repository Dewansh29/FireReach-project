# FireReach-project

FireReach is an advanced multi-agent application that automatically generates tailored outreach messaging. It utilizes a LangGraph workflow to research, draft, and QA content before sending the final approved draft via Formspree.

## Features
- **Multi-Agent Workflow**: Engineered with LangGraph incorporating a Researcher, Drafter, and QA agent.
- **FastAPI Backend**: Provides an efficient and responsive backend API structure.
- **React + Vite Frontend**: Includes a sleek and fast modern web interface.
- **Formspree Integration**: Automatically forwards approved outreach drafts to your inbox.

## Project Structure
- `backend/`: Fast API server, LangGraph routing (`graph.py`), and AI agents.
- `frontend/`: React frontend connected to the backend API (`trigger-agents`).
- `.env`: Contains your environment API keys (e.g., `OPENAI_API_KEY`).

## Prerequisites
- Python 3.9+
- Node.js (for frontend)
- valid OpenAI API Key (or designated LLM provider key)
- Formspree Endpoint

## Installation

### 1. Clone the repository
```bash
git clone https://github.com/Dewansh29/FireReach-project.git
cd FireReach-project
```

### 2. Backend Setup
Create and activate a virtual environment, then install Python requirements:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```
Make sure to create or update your `.env` file at the root to include your API keys.

### 3. Frontend Setup
Navigate to the frontend directory and install NPM packages:
```bash
cd frontend
npm install
```

## How to Run

**Start the Backend:**
From the root of the project, run:
```bash
# This will launch the backend on http://localhost:8000
python backend/main.py
```

**Start the Frontend:**
Open a new terminal, navigate to the frontend directory, and run:
```bash
cd frontend
npm run dev
```

## Usage
Once both servers are running:
1. Open the frontend URL (typically `http://localhost:5173`).
2. Input the Ideal Customer Profile (ICP) parameters (Target Role, Company Name, Domain, Value Proposition).
3. The multi-agent workflow will be triggered. It will run through the research, drafting, and QA phases.
4. If approved by the QA agent, the final draft is sent directly via Formspree!
