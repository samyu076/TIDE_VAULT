from fastapi import APIRouter
from core.data_loader import scan_and_register_datasets, DATASET_REGISTRY

router = APIRouter(prefix="/api/framework", tags=["Framework"])

@router.get("/scan")
def scan_framework():
    """
    Re-scans the data directory, updates the global registry,
    and returns the current state of the framework.
    """
    old_keys = set(DATASET_REGISTRY.keys())
    new_registry = scan_and_register_datasets()
    
    # Update the global registry in-place
    DATASET_REGISTRY.clear()
    DATASET_REGISTRY.update(new_registry)
    
    new_keys = set(DATASET_REGISTRY.keys())
    added = list(new_keys - old_keys)
    
    return {
        "scanned": True,
        "datasets_found": len(DATASET_REGISTRY),
        "new_datasets": added,
        "registry": DATASET_REGISTRY
    }
