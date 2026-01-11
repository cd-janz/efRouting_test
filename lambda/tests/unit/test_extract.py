import unittest
import pytest
from unittest.mock import Mock, AsyncMock
from src.spacex.infra.driven_adapters.launch_repository_impl import LaunchRepositoryImpl
from src.spacex.infra.models.LaunchRecord import LaunchRecord
from tests.unit.data.launch import launch_data


class ExtractionTest(unittest.IsolatedAsyncioTestCase):
    @pytest.mark.unit
    async def test_records_filter(self):
        data = [{}, launch_data]
        mock_response = Mock()
        mock_response.json.return_value = data
        mock_response.raise_for_status.return_value = None
        mock_client = AsyncMock()
        mock_client.get.return_value = mock_response
        repo = LaunchRepositoryImpl(client=mock_client)
        result = await repo.get_all()
        self.assertTrue(len(result) == 1)
        self.assertIsInstance(result[0], LaunchRecord)

if __name__ == '__main__':
    unittest.main()
