"""
patch-tenant-id.py - Set the TENANT_ID user attribute on all users for a given domain.
Use this to fix users created before the TENANT_ID attribute was added to add-tenant.py.

Usage:
    python patch-tenant-id.py --domain thitsaworks.com --admin-password <pw>
"""

import argparse
import json
import os
import sys
import urllib.parse
import urllib.request

base = "https://keycloak.beta.tazama.org"
realm = "tazama"


def http(method, url, token=None, data=None, content_type="application/json"):
    body = None
    if data is not None:
        if content_type == "application/x-www-form-urlencoded":
            body = urllib.parse.urlencode(data).encode()
        else:
            body = json.dumps(data).encode()
    req = urllib.request.Request(url, data=body, method=method)
    req.add_header("Content-Type", content_type)
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return r.status, json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        raw = e.read()
        try:
            payload = json.loads(raw)
        except:
            payload = raw.decode(errors="replace")
        return e.code, payload


def get_token(admin_password):
    body = urllib.parse.urlencode(
        {
            "grant_type": "password",
            "client_id": "admin-cli",
            "username": "admin",
            "password": admin_password,
        }
    ).encode()
    req = urllib.request.Request(
        f"{base}/realms/master/protocol/openid-connect/token", data=body, method="POST"
    )
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())["access_token"]


parser = argparse.ArgumentParser()
parser.add_argument("--domain", required=True)
parser.add_argument(
    "--tenant-id",
    default=None,
    help="Explicit TENANT_ID. Required in general: it is NOT derivable from the "
    "domain (e.g. processlab.tech -> CLEARDATA). Omit only if the tenant ID "
    "really is the first domain label uppercased.",
)
parser.add_argument("--admin-password", default=os.environ.get("KC_ADMIN_PW", ""))
args = parser.parse_args()

if not args.admin_password:
    print("ERROR: --admin-password required or set KC_ADMIN_PW env var")
    sys.exit(1)

domain = args.domain.lower()
tenant_id = args.tenant_id or domain.split(".")[0].upper()
if not args.tenant_id:
    print(
        f"WARNING: --tenant-id not given; derived '{tenant_id}' from domain. "
        "Verify this matches the canonical mapping before trusting the result."
    )

tok = get_token(args.admin_password)

# Find all users with this domain - search by email domain
url = (
    f"{base}/admin/realms/{realm}/users?email={urllib.parse.quote('@' + domain)}&max=50"
)
_, users = http("GET", url, token=tok)

updated = 0
for u in users:
    if not u.get("username", "").endswith("@" + domain):
        continue
    uid = u["id"]
    patch_url = f"{base}/admin/realms/{realm}/users/{uid}"
    attrs = u.get("attributes", {})
    attrs["TENANT_ID"] = [tenant_id]
    status, body = http("PUT", patch_url, token=tok, data={"attributes": attrs})
    if status in (200, 204):
        print(f"  Patched {u['username']} -> TENANT_ID={tenant_id}")
        updated += 1
    else:
        print(f"  ERROR {u['username']}: {status} {body}")

print(f"\nDone. {updated} users patched.")
