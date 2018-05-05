cd dist
tar cvfz ../npm-package.tar.gz *
cd ..
ls
npm run travis-deploy-once "npm run semantic-release"