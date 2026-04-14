from langgraph.graph import StateGraph, START, END
from backend.state import OutreachState
from backend.agents.researcher import research_node
from backend.agents.drafter import drafter_node
from backend.agents.qa_agent import qa_node

# Define the router logic
def router(state: OutreachState):
    if state.get("status") == "approved":
        return END
    return "drafter" # If not approved (rejected), go back to the drafter

# Initialize the graph
workflow = StateGraph(OutreachState)

# Add the nodes
workflow.add_node("researcher", research_node)
workflow.add_node("drafter", drafter_node)
workflow.add_node("qa", qa_node)

# Define the routing
workflow.add_edge(START, "researcher")
workflow.add_edge("researcher", "drafter")
workflow.add_edge("drafter", "qa")

# THE CONDITIONAL LOOP: From QA, it either goes to END, or loops back to Drafter
workflow.add_conditional_edges("qa", router)

# Compile the engine
app = workflow.compile()