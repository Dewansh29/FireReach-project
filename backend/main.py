from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import requests
from backend.graph import app as workflow_app

app = FastAPI(title="FireReach Advanced Multi-Agent Backend")

# Add CORS Middleware to allow requests from our React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to the frontend URL!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your Formspree Endpoint
FORMSPREE_URL = "https://formspree.io/f/mlgoqbbl"

class ICPRequest(BaseModel):
    target_role: str
    company_name: str
    company_domain: str
    value_proposition: str

def send_via_formspree(target_role: str, company: str, draft_content: str):
    """Sends the approved AI draft to your inbox via Formspree."""
    
    # Enforce strict word limit for Formspree to avoid delivery failures without altering the final API output
    words = draft_content.split()
    max_words = 40
    if len(words) > max_words:
        email_content = " ".join(words[:max_words]) + "\n\n... [Draft truncated for email due to strict word limits]"
    else:
        email_content = draft_content

    payload = {
        "email": "firereach-bot@example.com",
        "subject": f"FireReach Approved Draft: {target_role} at {company}",
        "message": f"The agents have approved the following outreach draft for {company}:\n\n{email_content}",
        "target_company": company,
        "target_role": target_role
    }
    
    # This header tells Formspree we are an API, bypassing the HTML CAPTCHA screen
    headers = {
        'Accept': 'application/json'
    }
    
    try:
        # Notice we changed data=payload to json=payload
        response = requests.post(FORMSPREE_URL, json=payload, headers=headers)
        response.raise_for_status() 
        return "Success - Delivered to Formspree!"
    except Exception as e:
        return f"Failed to send to Formspree: {str(e)}"

@app.get("/")
def read_root():
    return {"status": "FireReach Engine is online and ready."}

@app.post("/api/trigger-agents")
def trigger_agent_workflow(request: ICPRequest):
    initial_state = {
        "icp_target": request.target_role,
        "company_domain": request.company_domain,
        "status": "processing",
        "revision_count": 0
    }
    
    # 1. Run the Multi-Agent Graph
    final_state = workflow_app.invoke(initial_state)
    draft = final_state.get("current_draft")
    
    # 2. Fire off the draft to Formspree!
    delivery_status = send_via_formspree(
        target_role=request.target_role,
        company=request.company_name,
        draft_content=draft
    )
    
    return {
        "message": "Workflow completed",
        "delivery_status": delivery_status,
        "research_insights": final_state.get("research_data"),
        "final_draft": draft
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)