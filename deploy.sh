#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A
git commit -m 'New Development'
git push -f git@github.com:Jecjecflrs21/sample_scatchProj.git master:gh-pages

cd -