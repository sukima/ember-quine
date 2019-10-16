GIT_DEPLOY_DIR="./dist/gh-pages"
rm -rf "$GIT_DEPLOY_DIR"
mkdir "$GIT_DEPLOY_DIR"
cp "./dist/index.html" "${GIT_DEPLOY_DIR}/index.html"
