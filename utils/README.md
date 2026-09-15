# Utility Scripts

Standalone operational and administrative utilities for a deployed Tazama stack. Each script is self-contained: the Python scripts use only the standard library, and the Node.js script uses only built-in modules. No package installation is required.

Unless stated otherwise, scripts target the Keycloak instance at `https://keycloak.beta.tazama.org` (realm `tazama`) by default and accept overrides via command-line options. The Keycloak admin password is read from the `KC_ADMIN_PW` environment variable or an `--admin-password` option. Never commit credentials to this repository.

## Index

| Script | Purpose |
| --- | --- |
| [add-tenant.py](add-tenant.py) | Onboard a new tenant organization: create its Keycloak groups and users (Python) |
| [add-tenant.js](add-tenant.js) | Same as add-tenant.py, implemented in Node.js |
| [patch-tenant-id.py](patch-tenant-id.py) | Set or repair the `TENANT_ID` user attribute for all users of a given domain |

## add-tenant.py / add-tenant.js

Adds a complete access pack for a new member organization of the Sandbox to a live Keycloak instance via the Admin REST API. The two implementations are functionally identical; use whichever runtime is convenient.

For a tenant with domain `example.org` and tenant ID `EXAMPLE`, the script:

1. Ensures the organization subgroup (named after the uppercased domain, e.g. `EXAMPLE.ORG`) exists under every service group path that Tazama access control uses:
   - `/tazama-cms/CMS_ADMIN`, `/tazama-cms/CMS_COMPLIANCE_OFFICER`, `/tazama-cms/CMS_INVESTIGATOR`, `/tazama-cms/CMS_SUPERVISOR`
   - `/tazama-tcs/approver`, `/tazama-tcs/editor`, `/tazama-tcs/exporter`, `/tazama-tcs/publisher`
   - `/tazama-trs/approver`, `/tazama-trs/editor`, `/tazama-trs/publisher`
   - `/tazama-conditions`, `/tazama-config`, `/tazama-reports`, `/tazama-tms` (organization subgroup directly under the service group)
2. Sets the `TENANT_ID` attribute on every organization (leaf) subgroup to the value passed with `--tenant-id`. If a subgroup already exists without the attribute, it is healed in place, so re-running the script against an existing tenant repairs earlier gaps.
3. Creates 12 users (`cms-administrator@<domain>`, `cms-compliance-officer@`, `cms-investigator@`, `cms-supervisor@`, `tcs-approver@`, `tcs-editor@`, `tcs-exporter@`, `tcs-publisher@`, `trs-approver@`, `trs-editor@`, `trs-publisher@`, `tazama-api-client@`), each with the `TENANT_ID` user attribute set to the `--tenant-id` value and the shared password from `--password`. Existing users get their password reset and their `TENANT_ID` attribute corrected.
4. Assigns each user to its group paths and prints an onboarding report.

The tenant ID is deliberately an explicit argument and is never derived from the domain: the mapping is not mechanical (for example, the organization `processlab.tech` has tenant ID `CLEARDATA`).

Usage:

```
python add-tenant.py --domain example.org --tenant-id EXAMPLE --password <user-password> [--keycloak-url <url>] [--admin-user admin] [--admin-password <pw>] [--realm tazama] [--dry-run]

node add-tenant.js --domain example.org --tenant-id EXAMPLE --password <user-password> [same options]
```

Use `--dry-run` to preview every group and user operation without making changes.

## patch-tenant-id.py

Sets the `TENANT_ID` user attribute on all existing users whose username ends in `@<domain>`. Use this to repair users created before add-tenant.py set the attribute, or users created with a wrong value.

```
python patch-tenant-id.py --domain example.org --tenant-id EXAMPLE [--admin-password <pw>]
```

If `--tenant-id` is omitted the script falls back to deriving the value from the first domain label (uppercased) and prints a warning. Always pass the canonical tenant ID explicitly unless you have verified the derived value is correct.

## Adding new utilities

When adding a script to this folder:

1. Keep it self-contained (standard library or built-in modules only) so it can be run from any machine with the runtime installed.
2. Read secrets from environment variables or command-line options; never hard-code credentials or commit them here.
3. Provide a `--dry-run` option for anything that mutates a live system, where practical.
4. Add a row to the index table above and a short section describing the script's purpose, behaviour, and usage.
