module.exports = {
  parser: "vue-eslint-parse",
  parseOptions: {
    parse: "@typescript-eslint/parse",
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
    extends: [
      'plugin:vue/vue3-recomended',
      'plugin:@typescript-eslint/recomended',
      'prettier',
      'plugin:prettier/recomended'
    ],
    rules: {

    }
  }
}
