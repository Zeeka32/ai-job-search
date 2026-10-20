# Egypt job sources

Validated 2026-10-20. This file records source priority and access behavior;
it does not authorize bypassing a portal's published restrictions.

## Job platforms

| Source | Search mode | Notes |
|---|---|---|
| Tanqeeb Egypt | `tanqeeb-egypt-search` CLI | Public search/detail pages; aggregates other boards, so deduplicate. |
| LinkedIn | Existing `linkedin-search` CLI | Search with location `Egypt`; personal use and low volume only. |
| Wuzzuf | WebSearch fallback | Public listings are indexed, but its robots policy disallows this automation user agent. |
| Bayt Egypt | WebSearch fallback | Its robots policy disallows job-search paths. |
| Glassdoor Egypt | WebSearch fallback | Its robots policy blocks AI crawlers and search/API paths. |
| Jooble Egypt | WebSearch fallback | Use the official regional API only after obtaining and testing an Egypt-domain key; the free plan has a limited lifetime quota. |

Never convert the four fallback-only sources into direct scraping without a
fresh robots/terms review. An official Jooble adapter must read its key from
`JOOBLE_API_TOKEN`, never a CLI flag or committed file.

## Egyptian banks and financial institutions

First-party pages and official employer profiles take precedence over an
aggregator copy. Start with these employers, derived from the Central Bank of
Egypt's licensed-bank directory and major banks active in Egypt:

- Commercial International Bank (CIB): `https://www.cibeg.com/en/careers`
- Banque Misr: `https://www.banquemisr.com/en/Careers`
- National Bank of Egypt (NBE): `https://www.nbe.com.eg/`
- QNB Egypt: `https://www.qnb.com.eg/sites/qnb/qnbegypt/page/en/enalahlicareers.html`
- Arab African International Bank (AAIB): `https://aaib.com/why-join-aaib`
- Banque du Caire
- Bank of Alexandria (ALEXBANK)
- Agricultural Bank of Egypt
- Bank ABC Egypt
- HSBC Egypt
- Mashreq Egypt
- First Abu Dhabi Bank Misr (FABMISR)
- Emirates NBD Egypt
- Abu Dhabi Islamic Bank Egypt (ADIB)
- Crédit Agricole Egypt
- National Bank of Kuwait Egypt (NBK Egypt)
- Abu Dhabi Commercial Bank Egypt (ADCB Egypt)
- saib
- EG Bank
- Bank NXT
- Housing and Development Bank
- Export Development Bank of Egypt
- Suez Canal Bank
- Al Baraka Bank Egypt
- Faisal Islamic Bank of Egypt

For banks without a stable public vacancy endpoint, use WebSearch with the
exact bank name plus the role and `careers`, then verify the result is on the
bank's official domain or official LinkedIn employer page. Never treat a
generic CV-submission page as evidence of an open position.

## Bank-focused fallback queries

```text
("software engineer" OR "software developer" OR "backend engineer") ("CIB" OR "Banque Misr" OR "National Bank of Egypt" OR "QNB Egypt") Egypt
("software engineer" OR "DevOps" OR "cybersecurity") ("AAIB" OR "ALEXBANK" OR "Banque du Caire" OR "HSBC Egypt")
("digital banking" OR "core banking" OR payments OR fintech) careers Egypt bank
("مهندس برمجيات" OR "مطور برمجيات" OR "أمن معلومات") (بنك OR مصرف) مصر
```
