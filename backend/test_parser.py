from app.services.parser import parse_log


test = """
2026-04-18T18:07:41Z fw=KUDI-FW01 action=ALLOW proto=TCP src=10.10.7.9 dst=102.89.34.10 dport=443 bytes=37410
"""


result = parse_log(test)


print(result)