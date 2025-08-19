import sys

js = open('build/main-min.js').read()
css = open('build/styles-min.css').read()
html = open('build/index.html').read()

sys.stdout.write(
    html
        .replace("[JS]", '<script>' + js + '</script>')
        .replace("[CSS]", '<style>' + css + '</style>')
)
