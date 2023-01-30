# Welcome

Hi and welcome to this repository, I hope you find this solution a great fit for you, enjoy 🎉 and don't forget to star ⭐

## TLDR

How to use

- for help: `npx story-cli-generator --help`
- Example: `npx story-cli-generator -srcf './testlib/src/**/*.tsx' -ex './testlib/src/**/*.stories.tsx'`

## TLDR

How to use

- for help: `npx story-cli-generator --help`
- Example: `npx story-cli-generator -srcf './testlib/src/**/*.tsx' -ex './testlib/src/**/*.stories.tsx'`

## The problem

This repository was made as a solution to a problem I encounted in previous companies I had work with.
The problem was, that we already had a bunch of components and we wanted to start using storybook, but in order to use storybook, you would need to write lots of `story` file for each component, a tedious job when you have dozen or hundred of components.

## The solution

A quick stories file generator, it will create a story for each component.

## Notes

### This a very early MVP, thus it has it's limts.

- Only export default components will work.
- It create a story calling <Component /> just like that, not auto generating props on the fly.
- Currently has a hard coded template for creating a story file.

### Supports

- Passing exclude glob string.

### Next MVP version

- Able to pass your own template
- Generate props for components.
- Correlate exports from a component file to a story. (If you wrote many components in one file and named exported them)
- Testing
- Better documentino
