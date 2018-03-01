# for each folder in /src/components/MyComponent
for directory in src/components/*; do
  # 1. move to /components/my-component/src
  componentName="$(basename $directory)"
  dirName="$(echo $componentName | sed 's/\(.\)\([A-Z]\)/\1-\2/g' | tr '[:upper:]' '[:lower:]')"
  mkdir -p components/$dirName
  git mv src/components/$componentName components/$dirName/src
  # 2. add a package.json using a template
  # ...and set:
  #  - name to @scope/my-component
  PACKAGE_VERSION=$(node -p -e "require('./package.json').version")
  ctl-pkg -p $PACKAGE_VERSION -n govuk-react $dirName > components/$dirName/package.json
  git add components/$dirName/package.json
done

echo "components/**/es\n" >> .gitignore
echo "components/**/lib\n" >> .gitignore
git add .gitignore

rm src/components/.DS_Store
rmdir src/components

mkdir -p packages/storybook
git mv src/stories packages/storybook/stories
git mv .storybook packages/storybook/.storybook

mkdir -p packages/govuk-react/src/
git mv src/*.js packages/govuk-react/src/

mkdir -p packages/constants/src/
git mv src/constants packages/constants/src/

mkdir -p packages/icons/src/
git mv src/icons packages/icons/src/

mkdir -p packages/hoc/src/
git mv src/hoc packages/hoc/src/

ctl-up package.json

yarn add lerna@2 -D -W

git add yarn.lock
git add lerna.json

echo done
