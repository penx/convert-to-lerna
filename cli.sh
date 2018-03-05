PACKAGE_VERSION=$(node -p -e "require('./package.json').version")

# Make all React components modules
for directory in src/components/*; do
  componentName="$(basename $directory)"
  dirName="$(echo $componentName | sed 's/\(.\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')"
  mkdir -p components/$dirName
  git mv src/components/$componentName components/$dirName/src
  ctl-pkg -p $PACKAGE_VERSION -n govuk-react $dirName > components/$dirName/package.json
  git add components/$dirName/package.json
done

rm src/components/.DS_Store
rmdir src/components

mkdir -p packages/storybook
git mv src/stories packages/storybook/stories
git mv .storybook packages/storybook/.storybook

mkdir -p packages/govuk-react/src/
git mv src/*.js packages/govuk-react/src/
ctl-pkg -p $PACKAGE_VERSION -n govuk-react govuk-react > packages/govuk-react/package.json
git add packages/govuk-react/package.json

# Make all other src folders modules
for directory in src/*; do
  moduleName="$(basename $directory)"
  dirName="$(echo $moduleName | sed 's/\(.\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')"
  mkdir -p packages/$dirName
  git mv src/$moduleName packages/$dirName/src
  ctl-pkg -p $PACKAGE_VERSION -n govuk-react $dirName > packages/$dirName/package.json
  git add packages/$dirName/package.json
done

rm src/.DS_Store
rmdir src

ctl-up package.json

yarn add lerna@2 -D -W

# Update git
git add yarn.lock
git add lerna.json

echo "components/**/es\n" >> .gitignore
echo "components/**/lib\n" >> .gitignore
echo "packages/**/es\n" >> .gitignore
echo "packages/**/lib\n" >> .gitignore
git add .gitignore

echo done
