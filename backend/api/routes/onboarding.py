from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import json
import os
from datetime import datetime
import logging
from core.mcp_client import mcp_client

logger = logging.getLogger(__name__)

router = APIRouter()

class TutorialStep(BaseModel):
    step_id: str
    title: str
    description: str
    content: str
    code_examples: List[Dict[str, Any]]
    quiz_questions: List[Dict[str, Any]]
    estimated_time: int  # minutes

class Tutorial(BaseModel):
    tutorial_id: str
    title: str
    description: str
    difficulty: str  # beginner, intermediate, advanced
    steps: List[TutorialStep]
    prerequisites: List[str]
    total_estimated_time: int
    tags: List[str]

class UserProgress(BaseModel):
    user_id: str
    tutorial_id: str
    completed_steps: List[str]
    current_step: str
    start_date: datetime
    last_activity: datetime
    quiz_scores: Dict[str, float]

class ProgressResponse(BaseModel):
    tutorial_id: str
    progress_percentage: float
    completed_steps: int
    total_steps: int
    current_step: str
    next_step: str
    estimated_completion: int  # minutes

class InteractiveGuide(BaseModel):
    guide_id: str
    title: str
    type: str  # walkthrough, checklist, interactive
    content: List[Dict[str, Any]]
    dependencies: List[str]

class OnboardingRecommendation(BaseModel):
    user_id: str
    skill_level: str
    interests: List[str]
    recommended_tutorials: List[str]
    learning_path: List[str]

class TutorialManager:
    """Manage tutorials and learning content"""
    
    def __init__(self):
        self.tutorials = self._load_default_tutorials()
        self.user_progress = {}
    
    def _load_default_tutorials(self) -> Dict[str, Tutorial]:
        """Load default tutorial content"""
        return {
            "getting-started": Tutorial(
                tutorial_id="getting-started",
                title="Getting Started with IFastDocs",
                description="Learn the basics of using IFastDocs for documentation",
                difficulty="beginner",
                steps=[
                    TutorialStep(
                        step_id="intro",
                        title="Introduction to IFastDocs",
                        description="Understand what IFastDocs is and how it can help you",
                        content="IFastDocs is an AI-powered documentation assistant that helps you create, maintain, and consume technical documentation more effectively.",
                        code_examples=[],
                        quiz_questions=[
                            {
                                "question": "What is the main purpose of IFastDocs?",
                                "options": [
                                    "To replace all documentation",
                                    "To assist with documentation creation and maintenance",
                                    "To only generate code",
                                    "To manage databases"
                                ],
                                "correct_answer": 1
                            }
                        ],
                        estimated_time=5
                    ),
                    TutorialStep(
                        step_id="first-doc",
                        title="Create Your First Document",
                        description="Learn how to create documentation from code",
                        content="Use the code parsing feature to automatically generate documentation from your source code.",
                        code_examples=[
                            {
                                "language": "python",
                                "code": "def hello_world():\n    \"\"\"Simple greeting function\"\"\"\n    return \"Hello, World!\"",
                                "description": "Python function with docstring"
                            }
                        ],
                        quiz_questions=[
                            {
                                "question": "Which feature helps generate docs from code?",
                                "options": [
                                    "AI summarization",
                                    "Code parsing",
                                    "Drift detection",
                                    "Multilingual support"
                                ],
                                "correct_answer": 1
                            }
                        ],
                        estimated_time=10
                    ),
                    TutorialStep(
                        step_id="ai-features",
                        title="Using AI Features",
                        description="Explore AI-powered documentation features",
                        content="IFastDocs uses AI to help summarize content, answer questions, and generate documentation.",
                        code_examples=[],
                        quiz_questions=[
                            {
                                "question": "What AI feature helps with long documents?",
                                "options": [
                                    "Code parsing",
                                    "Summarization",
                                    "Drift detection",
                                    "File upload"
                                ],
                                "correct_answer": 1
                            }
                        ],
                        estimated_time=8
                    )
                ],
                prerequisites=[],
                total_estimated_time=23,
                tags=["basics", "introduction", "ai"]
            ),
            "advanced-features": Tutorial(
                tutorial_id="advanced-features",
                title="Advanced IFastDocs Features",
                description="Master advanced documentation features",
                difficulty="intermediate",
                steps=[
                    TutorialStep(
                        step_id="drift-detection",
                        title="Documentation Drift Detection",
                        description="Learn how to detect when docs become outdated",
                        content="Use drift detection to automatically identify when documentation needs updates based on code changes.",
                        code_examples=[],
                        quiz_questions=[],
                        estimated_time=15
                    ),
                    TutorialStep(
                        step_id="maintenance",
                        title="Automated Maintenance",
                        description="Set up automated documentation maintenance",
                        content="Configure webhooks and automated processes to keep documentation up-to-date.",
                        code_examples=[],
                        quiz_questions=[],
                        estimated_time=20
                    )
                ],
                prerequisites=["getting-started"],
                total_estimated_time=35,
                tags=["advanced", "maintenance", "automation"]
            )
        }
    
    def get_tutorial(self, tutorial_id: str) -> Optional[Tutorial]:
        """Get a specific tutorial"""
        return self.tutorials.get(tutorial_id)
    
    def get_all_tutorials(self, difficulty: Optional[str] = None) -> List[Tutorial]:
        """Get all tutorials, optionally filtered by difficulty"""
        if difficulty:
            return [t for t in self.tutorials.values() if t.difficulty == difficulty]
        return list(self.tutorials.values())
    
    def get_user_progress(self, user_id: str, tutorial_id: str) -> Optional[UserProgress]:
        """Get user progress for a specific tutorial"""
        key = f"{user_id}_{tutorial_id}"
        return self.user_progress.get(key)
    
    def update_progress(self, user_id: str, tutorial_id: str, step_id: str, quiz_score: Optional[float] = None):
        """Update user progress for a tutorial"""
        key = f"{user_id}_{tutorial_id}"
        
        if key not in self.user_progress:
            self.user_progress[key] = UserProgress(
                user_id=user_id,
                tutorial_id=tutorial_id,
                completed_steps=[],
                current_step=step_id,
                start_date=datetime.now(),
                last_activity=datetime.now(),
                quiz_scores={}
            )
        
        progress = self.user_progress[key]
        if step_id not in progress.completed_steps:
            progress.completed_steps.append(step_id)
        
        if quiz_score is not None:
            progress.quiz_scores[step_id] = quiz_score
        
        progress.last_activity = datetime.now()
        progress.current_step = step_id

class InteractiveGuideManager:
    """Manage interactive guides and walkthroughs"""
    
    def __init__(self):
        self.guides = self._load_default_guides()
    
    def _load_default_guides(self) -> Dict[str, InteractiveGuide]:
        """Load default interactive guides"""
        return {
            "quick-start": InteractiveGuide(
                guide_id="quick-start",
                title="Quick Start Guide",
                type="walkthrough",
                content=[
                    {
                        "type": "step",
                        "title": "Welcome",
                        "description": "Let's get you started with IFastDocs in 5 minutes",
                        "action": "next"
                    },
                    {
                        "type": "action",
                        "title": "Upload Code",
                        "description": "Upload a code file to see IFastDocs in action",
                        "action": "upload_file",
                        "target": "file_upload"
                    },
                    {
                        "type": "step",
                        "title": "Generate Docs",
                        "description": "Use AI to generate documentation from your code",
                        "action": "generate_docs",
                        "target": "ai_generation"
                    },
                    {
                        "type": "step",
                        "title": "Explore Features",
                        "description": "Try summarization, Q&A, and other AI features",
                        "action": "explore_features"
                    }
                ],
                dependencies=[]
            ),
            "api-documentation": InteractiveGuide(
                guide_id="api-documentation",
                title="API Documentation Guide",
                type="checklist",
                content=[
                    {
                        "type": "checklist_item",
                        "title": "Parse API Specification",
                        "description": "Upload your OpenAPI/Swagger spec",
                        "completed": False
                    },
                    {
                        "type": "checklist_item",
                        "title": "Generate Endpoint Docs",
                        "description": "Create comprehensive endpoint documentation",
                        "completed": False
                    },
                    {
                        "type": "checklist_item",
                        "title": "Add Examples",
                        "description": "Include request/response examples",
                        "completed": False
                    },
                    {
                        "type": "checklist_item",
                        "title": "Validate Documentation",
                        "description": "Ensure docs match your API",
                        "completed": False
                    }
                ],
                dependencies=["quick-start"]
            )
        }
    
    def get_guide(self, guide_id: str) -> Optional[InteractiveGuide]:
        """Get a specific interactive guide"""
        return self.guides.get(guide_id)
    
    def get_all_guides(self) -> List[InteractiveGuide]:
        """Get all interactive guides"""
        return list(self.guides.values())

# Global instances
tutorial_manager = TutorialManager()
guide_manager = InteractiveGuideManager()

@router.get("/tutorials")
async def get_tutorials(difficulty: Optional[str] = None):
    """Get available tutorials"""
    try:
        tutorials = tutorial_manager.get_all_tutorials(difficulty)
        return {
            "tutorials": [t.dict() for t in tutorials],
            "total": len(tutorials)
        }
    except Exception as e:
        logger.error(f"Error getting tutorials: {e}")
        raise HTTPException(status_code=500, detail="Failed to get tutorials")

@router.get("/tutorials/{tutorial_id}")
async def get_tutorial(tutorial_id: str):
    """Get a specific tutorial"""
    try:
        tutorial = tutorial_manager.get_tutorial(tutorial_id)
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        return tutorial.dict()
    except Exception as e:
        logger.error(f"Error getting tutorial {tutorial_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get tutorial")

@router.get("/tutorials/{tutorial_id}/progress")
async def get_tutorial_progress(tutorial_id: str, user_id: str):
    """Get user progress for a tutorial"""
    try:
        progress = tutorial_manager.get_user_progress(user_id, tutorial_id)
        tutorial = tutorial_manager.get_tutorial(tutorial_id)
        
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        if not progress:
            # Return initial progress
            return ProgressResponse(
                tutorial_id=tutorial_id,
                progress_percentage=0.0,
                completed_steps=0,
                total_steps=len(tutorial.steps),
                current_step=tutorial.steps[0].step_id if tutorial.steps else "",
                next_step=tutorial.steps[0].step_id if tutorial.steps else "",
                estimated_completion=tutorial.total_estimated_time
            )
        
        # Calculate progress
        completed_count = len(progress.completed_steps)
        total_steps = len(tutorial.steps)
        progress_percentage = (completed_count / total_steps) * 100 if total_steps > 0 else 0
        
        # Find next step
        next_step = ""
        for step in tutorial.steps:
            if step.step_id not in progress.completed_steps:
                next_step = step.step_id
                break
        
        # Estimate completion time
        remaining_steps = total_steps - completed_count
        estimated_completion = remaining_steps * 10  # Assume 10 min per step
        
        return ProgressResponse(
            tutorial_id=tutorial_id,
            progress_percentage=progress_percentage,
            completed_steps=completed_count,
            total_steps=total_steps,
            current_step=progress.current_step,
            next_step=next_step,
            estimated_completion=estimated_completion
        )
        
    except Exception as e:
        logger.error(f"Error getting progress: {e}")
        raise HTTPException(status_code=500, detail="Failed to get progress")

@router.post("/tutorials/{tutorial_id}/complete-step")
async def complete_tutorial_step(tutorial_id: str, user_id: str, step_id: str, quiz_score: Optional[float] = None):
    """Mark a tutorial step as completed"""
    try:
        tutorial = tutorial_manager.get_tutorial(tutorial_id)
        if not tutorial:
            raise HTTPException(status_code=404, detail="Tutorial not found")
        
        # Validate step exists
        step_exists = any(step.step_id == step_id for step in tutorial.steps)
        if not step_exists:
            raise HTTPException(status_code=400, detail="Invalid step ID")
        
        # Update progress
        tutorial_manager.update_progress(user_id, tutorial_id, step_id, quiz_score)
        
        return {"status": "step completed", "step_id": step_id}
        
    except Exception as e:
        logger.error(f"Error completing step: {e}")
        raise HTTPException(status_code=500, detail="Failed to complete step")

@router.get("/guides")
async def get_interactive_guides():
    """Get available interactive guides"""
    try:
        guides = guide_manager.get_all_guides()
        return {
            "guides": [g.dict() for g in guides],
            "total": len(guides)
        }
    except Exception as e:
        logger.error(f"Error getting guides: {e}")
        raise HTTPException(status_code=500, detail="Failed to get guides")

@router.get("/guides/{guide_id}")
async def get_interactive_guide(guide_id: str):
    """Get a specific interactive guide"""
    try:
        guide = guide_manager.get_guide(guide_id)
        if not guide:
            raise HTTPException(status_code=404, detail="Guide not found")
        
        return guide.dict()
    except Exception as e:
        logger.error(f"Error getting guide {guide_id}: {e}")
        raise HTTPException(status_code=500, detail="Failed to get guide")

@router.post("/recommendations")
async def get_onboarding_recommendations(request: OnboardingRecommendation):
    """Get personalized onboarding recommendations"""
    try:
        # Use MCP to get context-aware recommendations
        mcp_context = await mcp_client.get_context(
            f"User skill level: {request.skill_level}, interests: {', '.join(request.interests)}",
            "onboarding_recommendation"
        )
        
        # Generate recommendations based on skill level and interests
        recommendations = []
        if request.skill_level == "beginner":
            recommendations.extend(["getting-started", "quick-start"])
        elif request.skill_level == "intermediate":
            recommendations.extend(["advanced-features", "api-documentation"])
        
        # Add guides based on interests
        if "api" in request.interests:
            recommendations.append("api-documentation")
        if "automation" in request.interests:
            recommendations.append("advanced-features")
        
        # Create learning path
        learning_path = []
        if "getting-started" in recommendations:
            learning_path.append("getting-started")
        if "advanced-features" in recommendations:
            learning_path.append("advanced-features")
        
        return {
            "recommended_tutorials": recommendations,
            "learning_path": learning_path,
            "estimated_total_time": sum(
                tutorial_manager.get_tutorial(tid).total_estimated_time 
                for tid in recommendations 
                if tutorial_manager.get_tutorial(tid)
            )
        }
        
    except Exception as e:
        logger.error(f"Error getting recommendations: {e}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations")

@router.get("/health")
async def onboarding_health_check():
    """Check onboarding services health"""
    return {
        "status": "healthy",
        "tutorials_available": len(tutorial_manager.tutorials),
        "guides_available": len(guide_manager.guides),
        "total_users": len(set(progress.split('_')[0] for progress in tutorial_manager.user_progress.keys()))
    }
