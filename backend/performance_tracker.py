import time
from datetime import datetime

class PipelineTracker:
    def __init__(self):
        self.start_time = None
        self.end_time = None
        self.metrics = {
            "datasets_processed": 0,
            "features_analysed": 0,
            "issues_detected": 0,
            "parameters_computed": 0
        }

    def start(self):
        self.start_time = time.time()

    def stop(self, datasets=0, features=0, issues=0, params=0):
        self.end_time = time.time()
        self.metrics["datasets_processed"] = datasets
        self.metrics["features_analysed"] = features
        self.metrics["issues_detected"] = issues
        self.metrics["parameters_computed"] = params

    def get_report(self):
        if not self.start_time:
            return None
        
        duration = (self.end_time or time.time()) - self.start_time
        return {
            "processing_time_seconds": round(duration, 2),
            **self.metrics,
            "timestamp": datetime.now().isoformat()
        }

# Global instance
tracker = PipelineTracker()
# Pre-set with some representative values for immediate API demo
tracker.start()
tracker.stop(datasets=6, features=57, issues=18, params=23)
