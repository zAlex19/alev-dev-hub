import unittest

from query_params import build_query


class BuildQueryTests(unittest.TestCase):
    def test_preserves_falsey_values_that_are_not_none(self):
        self.assertEqual(
            build_query({"limit": 0, "active": False, "q": ""}),
            "limit=0&active=False&q=",
        )

    def test_omits_none_values(self):
        self.assertEqual(
            build_query({"limit": None, "page": 2}),
            "page=2",
        )

    def test_normal_values_are_unchanged(self):
        self.assertEqual(
            build_query({"tag": "python", "page": 1}),
            "tag=python&page=1",
        )


if __name__ == "__main__":
    unittest.main()
