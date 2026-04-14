import os
import json
import requests
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from backend.state import OutreachState

# Load environment variables
load_dotenv()

# Initialize the Groq model
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.2)
SERPER_API_KEY = os.getenv("SERPER_API_KEY")

def search_serper(query: str):
    """Hits the Serper API for web search results."""
    if not SERPER_API_KEY:
        return "No Serper API key found."
    
    url = "https://google.serper.dev/search"
    payload = json.dumps({"q": query})
    headers = {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(url, headers=headers, data=payload)
        response.raise_for_status()
        data = response.json()
        
        snippets = []
        for item in data.get("organic", [])[:5]: # Get top 5 results
            snippet = item.get("snippet", "")
            title = item.get("title", "")
            if snippet:
                snippets.append(f"Title: {title}\nSnippet: {snippet}")
        
        return "\n\n".join(snippets)
    except Exception as e:
        return f"Error retrieving search data: {str(e)}"

def research_node(state: OutreachState):
    print("--- OSINT AGENT: Researching ---")
    icp = state.get("icp_target", "Unknown Target")
    company = state.get("company_domain", "Unknown Company")
    
    # Live Search via Serper API
    search_query = f"{company} {icp} recent news pain points challenges"
    search_context = search_serper(search_query)
    
    prompt = f"""
    You are an elite B2B OSINT researcher. 
    Target Role: {icp}
    Target Company: {company}
    
    Here is the latest live context gathered from the web via Serper API:
    {search_context}
    
    Based on this live data, generate 3 highly specific, realistic business pain points or industry trends that a {icp} at {company} would currently be facing.
    Keep it concise and highly customized based on the search context.
    """
    
    response = llm.invoke(prompt)
    
    # Return the updated state
    return {
        "research_data": {"insights": response.content},
        "status": "research_complete"
    }