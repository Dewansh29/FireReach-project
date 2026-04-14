from langchain_groq import ChatGroq
from backend.state import OutreachState

llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.7)

def drafter_node(state: OutreachState):
    icp = state.get("icp_target", "")
    research = state.get("research_data", {}).get("insights", "")
    qa_feedback = state.get("qa_feedback", "")
    current_draft = state.get("current_draft", "")
    
    if qa_feedback:
        print("--- DRAFTER AGENT: Rewriting based on QA feedback ---")
        prompt = f"""
        You are an expert B2B copywriter. Your previous draft for a {icp} was rejected by the QA manager.
        
        Previous Draft: "{current_draft}"
        Manager's Feedback: "{qa_feedback}"
        
        Rewrite the message to strictly satisfy the manager's feedback. Keep the core insights intact:
        {research}
        """
    else:
        print("--- DRAFTER AGENT: Writing Initial Message ---")
        prompt = f"""
        You are an expert B2B copywriter. Write a cold outreach message to a {icp}.
        
        You MUST use the following research insights to make the message hyper-personalized:
        {research}
        
        Rules:
        - Keep it under 50 words.
        - Do NOT use typical AI words like "delve", "testament", or "navigate".
        - End with a low-friction question.
        """
    
    response = llm.invoke(prompt)
    
    return {
        "current_draft": response.content, 
        "status": "draft_complete"
    }