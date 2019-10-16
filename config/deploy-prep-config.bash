GIT_DEPLOY_REPO="$(dirname "$0")/../tmp/gh-pages"
rm -rf "$GIT_DEPLOY_REPO"
mkdir "$GIT_DEPLOY_REPO"
cp "$(dirname "$0")/../dist/index.html" "${GIT_DEPLOY_REPO}/index.html"
