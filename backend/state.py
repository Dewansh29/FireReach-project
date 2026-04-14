from typing import TypedDict, Annotated
import operator

class OutreachState(TypedDict):
    # Initial input from user
    icp_target: str
    company_domain: str
    
    # Data gathered by the OSINT Agent
    research_data: dict 
    
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