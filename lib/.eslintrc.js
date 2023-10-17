module.exports = {
    root: true,
    env: {
        node: true,
        'vue/setup-compiler-macros': true
    },
    extends: [
        'airbnb-base',
        'plugin:vue/vue3-recommended',
        '@vue/airbnb'
    ],
    parserOptions: {
        parser: '@babel/eslint-parser'
    },
    rules: {
        'arrow-parens': [
            'error',
            'as-needed'
        ],
        'comma-dangle': [
            'error',
            'never'
        ],
        indent: [
            'error',
            4
        ],
        'vue/html-indent': [
            'error',
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ],
        'import/prefer-default-export': 'off',
        'import/no-unresolved': 'off',
        'import/no-import-module-exports': 'off',
        'import/no-relative-packages': 'off',
        'import/extensions': 'off',
        'max-len': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)'
            ],
            env: {
                jest: true
            }
        }
    ]
};
