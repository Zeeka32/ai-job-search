# Egypt Software-Engineering Search Strategy

This fork targets software-engineering opportunities in Egypt, with Egyptian
banks and financial institutions as the priority sector. Search in English and
Arabic because local employers use both. Candidate-specific seniority, stack,
and commute constraints still come from `CLAUDE.md` after `/setup` is run.

See `egypt-sources.md` for access constraints and the maintained bank list.

## Installed portal CLIs (primary)

- `tanqeeb-egypt-search`: public Egypt search/detail pages; use `--jobage 14`
  and `--location Egypt` (or Cairo/Giza/Alexandria).
- `linkedin-search`: use `--location "Egypt" --jobage 14`.
- `freehire-search`: optional secondary source for Egypt/remote technical roles.
- The four Danish demo portals remain installed but disabled.

## WebSearch fallbacks

Use these when a portal has no permitted, verified CLI or when an enabled CLI
fails. Do not bypass robots rules, login walls, or bot protection.

```text
site:wuzzuf.net ("software engineer" OR "software developer" OR "backend developer") Egypt
site:wuzzuf.net ("مهندس برمجيات" OR "مطور برمجيات") مصر
site:bayt.com/en/egypt/jobs ("software engineer" OR "software developer")
site:eg.jooble.org ("software engineer" OR "backend developer") Egypt
site:glassdoor.com/Job/egypt ("software engineer" OR "software developer")
site:egypt.tanqeeb.com ("software engineer" OR "مهندس برمجيات")
```

## Priority 1: Software engineering

Run the following title variants independently; do not put every synonym into
one portal request if that portal treats the phrase literally.

```text
software engineer
software developer
backend engineer
backend developer
frontend engineer
frontend developer
full stack engineer
full stack developer
مهندس برمجيات
مطور برمجيات
مطور نظم
```

## Priority 2: Banking technology and digital banking

```text
software engineer bank
backend engineer fintech
digital banking engineer
core banking developer
payments engineer
API integration engineer bank
banking applications support
مهندس برمجيات بنك
مطور أنظمة بنكية
تكنولوجيا المعلومات بنك
```

Search the employer sites and official career profiles listed in
`egypt-sources.md` before relying on aggregator copies. Use combinations of the
role terms above with each bank name.

## Priority 3: Platform, cloud, and security

```text
DevOps engineer
site reliability engineer
cloud engineer
cybersecurity engineer
application security engineer
information security bank
مهندس حوسبة سحابية
مهندس أمن معلومات
أمن سيبراني بنك
```

## Priority 4: Data and adjacent technical roles

```text
data engineer
business intelligence developer
integration developer
systems analyst
technical business analyst
quality assurance engineer
مهندس بيانات
محلل نظم
مطور ذكاء أعمال
```

## Location scope

Primary scope is Egypt. Prioritize Cairo, New Cairo, Giza, Smart Village,
Sheikh Zayed, 6th of October, and remote roles open to Egypt. Include
Alexandria when the candidate's commute/relocation preferences permit it.
Never infer commute acceptance before `CLAUDE.md` is populated.

## Freshness and source priority

- Prefer postings from the last 14 days.
- Prefer the bank/employer's own posting, then a verified portal detail page,
  then an indexed WebSearch result.
- Tanqeeb and Jooble aggregate other sources. Deduplicate by canonical URL and
  company/title before presenting results.
- When an indexed result has no live employer or portal page, mark it
  unreachable rather than presenting it as open.
