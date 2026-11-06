#!/bin/sh
# Bouwt de publieke site naar _site, met dezelfde uitsluitingen als .github/workflows/deploy-pages.yml.
# Gebruikt voor preview-deployments (geen CNAME: een preview mag nooit het productiedomein claimen).
set -e
rm -rf _site && mkdir _site
tar -X deploy-exclude.txt --exclude='./CNAME' -cf - . | tar -xf - -C _site
test -f _site/index.html && test ! -e _site/server && test ! -e _site/docs && test ! -e _site/CNAME
echo "preview-site: $(find _site -type f | wc -l) bestanden"
