from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from typing import Optional
from backend.graph import app as workflow_app
from backend.email_sender import send_email

app = FastAPI(title="FireReach Advanced Multi-Agent Backend")

# Add CORS Middleware to allow requests from our React App
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to the frontend URL!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ICPRequest(BaseModel):
    target_role: str
    company_name: str
    company_domain: str
    value_proposition: str
    candidate_email: Optional[str] = None


class SendEmailRequest(BaseModel):
    candidate_email: str
    subject: str
    body: str


@app.get("/")
def read_root():
    return {"status": "FireReach Engine is online and ready."}


@app.post("/api/send-email")
def send_email_endpoint(request: SendEmailRequest):
    """
    Send an outreach email via SMTP.
    Credentials are read from SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS.
    """
    result = send_email(
        to=request.candidate_email,
        subject=request.subject,
        body=request.body,
    )
    return {"status": result}


@app.post("/api/trigger-agents")
def trigger_agent_workflow(request: ICPRequest):
    initial_state = {
        "icp_target": request.target_role,
        "company_domain": request.company_domain,
        "company_name": request.company_name,
        "value_proposition": request.value_proposition,
        "candidate_email": request.candidate_email or "",
        "sender_email": "",  # No longer needed — SMTP_USER is the sender
        "status": "processing",
        "revision_count": 0,
    }

    # Run the Multi-Agent Graph
    final_state = workflow_app.invoke(initial_state)
    draft = final_state.get("current_draft")
    hunter_emails = final_state.get("hunter_emails", [])

    return {
        "message": "Workflow completed",
        "research_insights": final_state.get("research_data"),
        "final_draft": draft,
        "hunter_emails": hunter_emails,
        "candidate_email": final_state.get("candidate_email"),
    }


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)