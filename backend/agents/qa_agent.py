from langchain_groq import ChatGroq
from backend.state import OutreachState

# Using a slightly lower temperature for strict, analytical grading
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.1)

def qa_node(state: OutreachState):
    print("--- QA AGENT: Reviewing Draft ---")
    draft = state.get("current_draft", "")
    revision_count = state.get("revision_count", 0)
    
    # Prevent infinite loops: if it's been revised 2 times already, just pass it
    if revision_count >= 2:
        print("--- QA AGENT: Max revisions reached, approving. ---")
        return {"status": "approved"}

    prompt = f"""
    You are a strict B2B Sales Manager reviewing a cold email draft.
    
    Draft to review:
    "{draft}"
    
    Critique the draft based on these rules:
    1. Is it under 50 words? (If it's too long, it fails).
    2. Does it sound like a robot wrote it? (If it uses words like "moreover", "delve", "testament", it fails).
    3. Is it too sales-pitchy? (If it sounds like a hard sell, it fails).
    
    If it passes all rules, reply with exactly one word: PASS
    If it fails, reply with the word FAIL followed by a 1-sentence instruction on how to fix it. 
    Example: FAIL - The email is too long and sounds too formal. Make it punchier.
    """
    
    response = llm.invoke(prompt).content.strip()
    
    if response.startswith("PASS"):
        print("--- QA AGENT: Draft Approved! ---")
        return {"status": "approved"}
    else:
        print(f"--- QA AGENT: Draft Rejected. Feedback: {response} ---")
        return {
            "status": "rejected",
            "qa_feedback": response.replace("FAIL - ", "").replace("FAIL", "").strip(),
            "revision_count": revision_count + 1
        }