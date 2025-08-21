import re
from collections import Counter

minified_js = open('build/main-min.js').read()

no_strings = re.sub(
    r'"([^"]|\\")*"|`([^`]|\\`)*`|\'([^\']|\\\')*\'',
    '""',
    minified_js,
)
# no_strings = re.sub(r"'([^']|\\')+'", "''", no_strings)
# no_strings = re.sub(r"`([^`]|\\`)+`", "``", no_strings)

# print(no_strings)

matches = re.findall(r'[a-zA-Z][a-zA-Z0-9]{2,}', no_strings)

for word, count in Counter(matches).most_common():
    print(word, count)
