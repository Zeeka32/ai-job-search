import re
import unittest
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:  # Python 3.10: textual assertions still run.
    tomllib = None


ROOT = Path(__file__).resolve().parent.parent

ADAPTERS = {
    "job-setup": ".claude/commands/setup.md",
    "job-scrape": ".claude/skills/job-scraper/SKILL.md",
    "job-rank": ".claude/commands/rank.md",
    "job-apply": ".claude/commands/apply.md",
    "job-outcome": ".claude/commands/outcome.md",
    "job-interview": ".claude/commands/interview.md",
    "job-expand": ".claude/commands/expand.md",
    "job-upskill": ".claude/skills/upskill/SKILL.md",
    "job-gmail-sync": ".claude/commands/gmail-sync.md",
    "job-notion-sync": ".claude/commands/notion-sync.md",
    "job-html-report": ".claude/commands/html-report.md",
    "job-add-template": ".claude/commands/add-template.md",
    "job-add-portal": ".claude/commands/add-portal.md",
    "job-reset": ".claude/commands/reset.md",
}

ROLES = {
    "posting_fetcher": ("posting-fetcher.toml", ".claude/agents/posting-fetcher.md"),
    "posting_scorer": ("posting-scorer.toml", ".claude/agents/posting-scorer.md"),
    "application_reviewer": (
        "application-reviewer.toml",
        ".claude/agents/application-reviewer.md",
    ),
}


class CodexCompatibilityTests(unittest.TestCase):
    def test_all_adapters_are_thin_valid_pointers(self):
        runtime = ROOT / ".agents" / "references" / "codex-runtime.md"
        self.assertTrue(runtime.is_file())

        actual = {
            path.parent.name
            for path in (ROOT / ".agents" / "skills").glob("job-*/SKILL.md")
        }
        self.assertEqual(actual, set(ADAPTERS))

        for name, canonical in ADAPTERS.items():
            with self.subTest(name=name):
                adapter = ROOT / ".agents" / "skills" / name / "SKILL.md"
                text = adapter.read_text(encoding="utf-8")
                self.assertRegex(text, rf"(?m)^name:\s*{re.escape(name)}\s*$")
                self.assertRegex(text, r"(?m)^description:\s*\S")
                self.assertIn(".agents/references/codex-runtime.md", text)
                self.assertIn(canonical, text)
                self.assertTrue((ROOT / canonical).is_file())
                self.assertLessEqual(len(text.splitlines()), 16)

    def test_agents_file_routes_every_adapter(self):
        text = (ROOT / "AGENTS.md").read_text(encoding="utf-8")
        for name, canonical in ADAPTERS.items():
            with self.subTest(name=name):
                self.assertIn(f"${name}", text)
                self.assertIn(canonical, text)

    def test_codex_config_is_conservative_and_roles_resolve(self):
        config_path = ROOT / ".codex" / "config.toml"
        raw = config_path.read_text(encoding="utf-8")
        self.assertIn('approval_policy = "on-request"', raw)
        self.assertIn('sandbox_mode = "workspace-write"', raw)
        self.assertIn("network_access = false", raw)

        if tomllib is not None:
            config = tomllib.loads(raw)
            self.assertEqual(config["approval_policy"], "on-request")
            self.assertEqual(config["sandbox_mode"], "workspace-write")
            self.assertFalse(config["sandbox_workspace_write"]["network_access"])
            for role, (filename, _) in ROLES.items():
                self.assertEqual(
                    config["agents"][role]["config_file"],
                    f"agents/{filename}",
                )

        for _, (filename, canonical) in ROLES.items():
            with self.subTest(filename=filename):
                role_path = ROOT / ".codex" / "agents" / filename
                role = role_path.read_text(encoding="utf-8")
                self.assertIn('sandbox_mode = "read-only"', role)
                self.assertIn(canonical, role)
                self.assertTrue((ROOT / canonical).is_file())


if __name__ == "__main__":
    unittest.main()
