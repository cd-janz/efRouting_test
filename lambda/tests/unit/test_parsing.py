import unittest

from src.spacex.infra.models.LaunchRecord import LaunchRecord
from tests.unit.data.launch import launch_data

class TestParsing(unittest.TestCase):

    def test_json_to_launch_record(self):
        res = LaunchRecord.safe_parse(launch_data)
        record = res[0]
        err = res[1]
        self.assertTrue(record is not None)
        self.assertTrue(isinstance(record, LaunchRecord))
        self.assertIsInstance(record, LaunchRecord)
        self.assertTrue(record.launch_id is not None)
        self.assertEqual(record.launch_id, launch_data['id'])

    def test_bad_json(self):
        res = LaunchRecord.safe_parse({})
        self.assertTrue(res[0] is None)
        self.assertTrue(res[1] is not None)
        self.assertIsInstance(res[1], str)

if __name__ == '__main__':
    unittest.main()