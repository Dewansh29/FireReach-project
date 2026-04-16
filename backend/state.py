from typing import TypedDict, Annotated, List
import operator

class OutreachState(TypedDict):
    # Initial input from user
    icp_target: str
    company_domain: str
    company_name: str
    value_proposition: str
    candidate_email: str      # Optional: email to send outreach to
    sender_email: str         # Google authenticated sender email

    # Data gathered by the OSINT Agent
    research_data: dict

    # Hunter.io discovered emails
    hunter_emails: List[dict]

    # Strategy decided by the Multi-Channel Agent
    selected_channel: str

    # The drafting loop variables
    current_draft: str
    qa_feedback: str
    revision_count: int

    # Overall workflow status
    status: str

    # LangGraph requires a way to append messages to history
    messages: Annotated[list, operator.add]