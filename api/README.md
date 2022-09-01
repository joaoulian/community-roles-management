### How to run

Run in the local machine

```bash
npm install

# and
npm run start:dev
```

### How to use

- `start:dev`: runs your application
- `build`: creates the production build version
- `lint`: runs the linter in all files
- `lint-and-fix`: runs the linter in all files and automatically fix problems
- `prettier-format`: runs the prettier in all files and automatically fix problems
- `tsc`: runs the ts type checking in all files
- `test`: runs jest to test all components and pages
- `test:watch`: runs jest in watch mode

### Mapping a new folder
- Add the key value correspondent on the `tsconfig.json` file
`"@<module-name>/*": ["<module-relative-path>/*"]`

- Add the key value correspondent on the `jest.config.js` file
`'@<module-name>/(.*)': '<rootDir>/<module-relative-path>/$1'`