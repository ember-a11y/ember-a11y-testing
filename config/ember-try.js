/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'ember-1.13',
      bower: {
        dependencies: {
          'ember': '~1.13.0'
        }
      },
    },
    {
      name: 'ember-release',
      npm: {
        devDependencies: {
          'ember-source': 'release'
        },
      },
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember-source': 'beta'
        }
      },
    },
    {
      name: 'ember-canary',
      allowedToFail: true,
      npm: {
        devDependencies: {
          'ember-source': 'canary'
        }
      },
    },
    {
      name: 'ember-lts-2.4',
      bower: {
        dependencies: {
          'ember': 'lts-2-4'
        }
      },
    },
    {
      name: 'ember-lts-2.8',
      bower: {
        dependencies: {
          'ember': 'lts-2-8'
        }
      },
    },
    {
      name: 'ember-lts-2.12',
      npm: {
        devDependencies: {
          'ember-source': 'lts-2-12'
        }
      }
    },
    {
      name: 'ember-lts-2.16',
      npm: {
        devDependencies: {
          'ember-source': 'lts-2-16'
        }
      }
    },
  ]
};
