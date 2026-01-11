from typing import Protocol, Any, List

class LaunchRepository(Protocol):
    async def get(self, launch_id: str) -> Any:
        ...
    async def get_all(self) -> List[Any]:
        ...