import json
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parent.parent


class EgyptMarketTests(unittest.TestCase):
    def test_egypt_sources_and_queries_are_registered(self):
        queries = (ROOT / ".claude/skills/job-scraper/search-queries.md").read_text()
        sources = (ROOT / ".claude/skills/job-scraper/egypt-sources.md").read_text()
        for portal in ("Wuzzuf", "Bayt", "Tanqeeb", "Glassdoor", "Jooble"):
            self.assertIn(portal, queries + sources)
        for bank in ("CIB", "Banque Misr", "National Bank of Egypt", "QNB Egypt"):
            self.assertIn(bank, sources)
        self.assertIn("software engineer", queries.lower())
        self.assertIn("مهندس برمجيات", queries)

    def test_tanqeeb_skill_contract_and_permission(self):
        skill = ROOT / ".agents/skills/tanqeeb-egypt-search"
        for relative in (
            "SKILL.md",
            "url-reference.md",
            "cli/package.json",
            "cli/tsconfig.json",
            "cli/src/cli.ts",
            "cli/src/helpers.ts",
            "cli/src/commands/search.ts",
            "cli/src/commands/detail.ts",
        ):
            self.assertTrue((skill / relative).is_file(), relative)
        settings = json.loads((ROOT / ".claude/settings.json").read_text())
        permission = "Bash(bun run .agents/skills/tanqeeb-egypt-search/cli/src/cli.ts:*)"
        self.assertIn(permission, settings["permissions"]["allow"])
        self.assertIn(permission, (ROOT / "tools/security_guards.py").read_text())

    def test_danish_demo_portals_remain_disabled(self):
        for name in ("jobbank", "jobdanmark", "jobindex", "jobnet"):
            text = (ROOT / f".agents/skills/{name}-search/SKILL.md").read_text()
            self.assertIn("enabled: false", text)


if __name__ == "__main__":
    unittest.main()
