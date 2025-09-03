from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import hashlib
import json
import os
from datetime import datetime, timedelta
import logging
from core.mcp_client import mcp_client

logger = logging.getLogger(__name__)

router = APIRouter()

class DocDriftRequest(BaseModel):
    code_files: List[str]
    doc_files: List[str]
    repository_url: Optional[str] = None

class DocDriftResponse(BaseModel):
    total_files: int
    drifted_files: List[Dict[str, Any]]
    drift_score: float
    recommendations: List[str]

class ChangeNotificationRequest(BaseModel):
    component_name: str
    change_type: str  # added, modified, deleted
    file_path: str
    commit_hash: Optional[str] = None
    timestamp: datetime

class ChangeNotificationResponse(BaseModel):
    notification_id: str
    status: str
    affected_docs: List[str]
    action_required: bool

class DocUpdateSuggestion(BaseModel):
    doc_file: str
    suggested_changes: List[Dict[str, Any]]
    confidence: float
    priority: str  # high, medium, low

class DocUpdateSuggestionResponse(BaseModel):
    suggestions: List[DocUpdateSuggestion]
    total_suggestions: int
    estimated_effort: int  # minutes

class RepositoryMonitor(BaseModel):
    repository_url: str
    last_check: datetime
    status: str
    total_files: int
    monitored_files: List[str]

class DocDriftDetector:
    """Detect documentation drift by comparing code and docs"""
    
    def __init__(self):
        self.code_hashes = {}
        self.doc_hashes = {}
    
    def calculate_file_hash(self, file_path: str) -> str:
        """Calculate SHA256 hash of file content"""
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
                return hashlib.sha256(content).hexdigest()
        except Exception as e:
            logger.error(f"Error calculating hash for {file_path}: {e}")
            return ""
    
    def detect_drift(self, code_files: List[str], doc_files: List[str]) -> Dict[str, Any]:
        """Detect drift between code and documentation"""
        drifted_files = []
        total_files = len(code_files) + len(doc_files)
        
        # Calculate hashes for code files
        for file_path in code_files:
            if os.path.exists(file_path):
                self.code_hashes[file_path] = self.calculate_file_hash(file_path)
        
        # Calculate hashes for doc files
        for file_path in doc_files:
            if os.path.exists(file_path):
                self.doc_hashes[file_path] = self.calculate_file_hash(file_path)
        
        # Check for drift patterns
        for code_file in code_files:
            if not os.path.exists(code_file):
                continue
                
            # Look for corresponding documentation
            doc_file = self._find_corresponding_doc(code_file)
            if doc_file and os.path.exists(doc_file):
                # Check if docs are outdated
                if self._is_doc_outdated(code_file, doc_file):
                    drifted_files.append({
                        "file_path": code_file,
                        "doc_file": doc_file,
                        "drift_type": "outdated",
                        "severity": "high",
                        "last_modified": datetime.fromtimestamp(os.path.getmtime(code_file))
                    })
            else:
                # No documentation found
                drifted_files.append({
                    "file_path": code_file,
                    "doc_file": None,
                    "drift_type": "missing",
                    "severity": "medium",
                    "last_modified": datetime.fromtimestamp(os.path.getmtime(code_file))
                })
        
        drift_score = len(drifted_files) / total_files if total_files > 0 else 0
        
        return {
            "total_files": total_files,
            "drifted_files": drifted_files,
            "drift_score": drift_score
        }
    
    def _find_corresponding_doc(self, code_file: str) -> Optional[str]:
        """Find corresponding documentation file"""
        base_name = os.path.splitext(code_file)[0]
        possible_docs = [
            f"{base_name}.md",
            f"{base_name}.rst",
            f"{base_name}.txt",
            f"README.md",
            f"docs/{os.path.basename(base_name)}.md"
        ]
        
        for doc in possible_docs:
            if os.path.exists(doc):
                return doc
        return None
    
    def _is_doc_outdated(self, code_file: str, doc_file: str) -> bool:
        """Check if documentation is outdated compared to code"""
        code_time = os.path.getmtime(code_file)
        doc_time = os.path.getmtime(doc_file)
        
        # Consider docs outdated if they're more than 1 day older than code
        return (code_time - doc_time) > 86400  # 24 hours in seconds

class ChangeMonitor:
    """Monitor changes and notify about documentation updates needed"""
    
    def __init__(self):
        self.notifications = []
        self.monitored_components = {}
    
    def add_notification(self, notification: ChangeNotificationRequest) -> str:
        """Add a new change notification"""
        notification_id = hashlib.md5(
            f"{notification.component_name}{notification.timestamp}".encode()
        ).hexdigest()
        
        notification_dict = notification.dict()
        notification_dict["notification_id"] = notification_id
        notification_dict["status"] = "pending"
        notification_dict["affected_docs"] = self._find_affected_docs(notification)
        notification_dict["action_required"] = len(notification_dict["affected_docs"]) > 0
        
        self.notifications.append(notification_dict)
        return notification_id
    
    def _find_affected_docs(self, notification: ChangeNotificationRequest) -> List[str]:
        """Find documentation files affected by a change"""
        affected_docs = []
        
        # Simple heuristic: look for docs with similar names
        base_name = os.path.splitext(notification.file_path)[0]
        possible_docs = [
            f"{base_name}.md",
            f"{base_name}.rst",
            f"docs/{os.path.basename(base_name)}.md"
        ]
        
        for doc in possible_docs:
            if os.path.exists(doc):
                affected_docs.append(doc)
        
        return affected_docs
    
    def get_notifications(self, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get notifications, optionally filtered by status"""
        if status:
            return [n for n in self.notifications if n["status"] == status]
        return self.notifications

class DocUpdateSuggester:
    """Suggest documentation updates based on code changes"""
    
    def __init__(self):
        self.suggestions = []
    
    async def generate_suggestions(self, code_changes: List[Dict[str, Any]]) -> List[DocUpdateSuggestion]:
        """Generate documentation update suggestions"""
        suggestions = []
        
        for change in code_changes:
            # Use MCP to get context-aware suggestions
            mcp_context = await mcp_client.get_context(
                f"Code change in {change.get('file_path', 'unknown')}: {change.get('change_type', 'unknown')}",
                "doc_update"
            )
            
            # Generate suggestions based on change type
            if change.get("change_type") == "added":
                suggestions.append(DocUpdateSuggestion(
                    doc_file=f"docs/{os.path.splitext(change.get('file_path', ''))[0]}.md",
                    suggested_changes=[
                        {
                            "type": "add_section",
                            "content": f"Document the new {change.get('component_name', 'component')}",
                            "priority": "high"
                        }
                    ],
                    confidence=0.9,
                    priority="high"
                ))
            elif change.get("change_type") == "modified":
                suggestions.append(DocUpdateSuggestion(
                    doc_file=f"docs/{os.path.splitext(change.get('file_path', ''))[0]}.md",
                    suggested_changes=[
                        {
                            "type": "update_section",
                            "content": f"Update documentation for modified {change.get('component_name', 'component')}",
                            "priority": "medium"
                        }
                    ],
                    confidence=0.7,
                    priority="medium"
                ))
        
        return suggestions

# Global instances
drift_detector = DocDriftDetector()
change_monitor = ChangeMonitor()
update_suggester = DocUpdateSuggester()

@router.post("/detect-drift", response_model=DocDriftResponse)
async def detect_documentation_drift(request: DocDriftRequest):
    """Detect documentation drift between code and docs"""
    try:
        result = drift_detector.detect_drift(request.code_files, request.doc_files)
        
        # Generate recommendations
        recommendations = []
        if result["drift_score"] > 0.3:
            recommendations.append("High documentation drift detected. Consider comprehensive review.")
        if any(f["drift_type"] == "missing" for f in result["drifted_files"]):
            recommendations.append("Several code files lack documentation. Prioritize creating missing docs.")
        if any(f["drift_type"] == "outdated" for f in result["drifted_files"]):
            recommendations.append("Update outdated documentation to match recent code changes.")
        
        return DocDriftResponse(
            total_files=result["total_files"],
            drifted_files=result["drifted_files"],
            drift_score=result["drift_score"],
            recommendations=recommendations
        )
        
    except Exception as e:
        logger.error(f"Drift detection error: {e}")
        raise HTTPException(status_code=500, detail="Drift detection failed")

@router.post("/notify-change", response_model=ChangeNotificationResponse)
async def notify_component_change(request: ChangeNotificationRequest):
    """Notify about a component change that may require doc updates"""
    try:
        notification_id = change_monitor.add_notification(request)
        
        # Get the notification details
        notification = next(
            (n for n in change_monitor.notifications if n["notification_id"] == notification_id),
            None
        )
        
        if notification:
            return ChangeNotificationResponse(
                notification_id=notification_id,
                status=notification["status"],
                affected_docs=notification["affected_docs"],
                action_required=notification["action_required"]
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create notification")
            
    except Exception as e:
        logger.error(f"Change notification error: {e}")
        raise HTTPException(status_code=500, detail="Change notification failed")

@router.get("/notifications")
async def get_change_notifications(status: Optional[str] = None):
    """Get change notifications"""
    try:
        notifications = change_monitor.get_notifications(status)
        return {
            "notifications": notifications,
            "total": len(notifications)
        }
    except Exception as e:
        logger.error(f"Error getting notifications: {e}")
        raise HTTPException(status_code=500, detail="Failed to get notifications")

@router.post("/suggest-updates", response_model=DocUpdateSuggestionResponse)
async def suggest_documentation_updates(code_changes: List[Dict[str, Any]]):
    """Suggest documentation updates based on code changes"""
    try:
        suggestions = await update_suggester.generate_suggestions(code_changes)
        
        # Calculate estimated effort
        total_effort = sum(len(s.suggested_changes) * 5 for s in suggestions)  # 5 min per change
        
        return DocUpdateSuggestionResponse(
            suggestions=suggestions,
            total_suggestions=len(suggestions),
            estimated_effort=total_effort
        )
        
    except Exception as e:
        logger.error(f"Update suggestion error: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate update suggestions")

@router.post("/webhook/github")
async def github_webhook(background_tasks: BackgroundTasks, payload: Dict[str, Any]):
    """Handle GitHub webhooks for automatic change detection"""
    try:
        # Extract relevant information from webhook payload
        if "commits" in payload:
            for commit in payload["commits"]:
                for file_change in commit.get("modified", []) + commit.get("added", []) + commit.get("removed", []):
                    change_type = "modified"
                    if file_change in commit.get("added", []):
                        change_type = "added"
                    elif file_change in commit.get("removed", []):
                        change_type = "deleted"
                    
                    # Create notification
                    notification = ChangeNotificationRequest(
                        component_name=os.path.basename(file_change),
                        change_type=change_type,
                        file_path=file_change,
                        commit_hash=commit.get("id"),
                        timestamp=datetime.now()
                    )
                    
                    background_tasks.add_task(
                        change_monitor.add_notification,
                        notification
                    )
        
        return {"status": "webhook processed"}
        
    except Exception as e:
        logger.error(f"GitHub webhook error: {e}")
        raise HTTPException(status_code=500, detail="Webhook processing failed")

@router.get("/health")
async def maintenance_health_check():
    """Check maintenance services health"""
    return {
        "status": "healthy",
        "drift_detector": "active",
        "change_monitor": "active",
        "update_suggester": "active",
        "total_notifications": len(change_monitor.notifications)
    }
