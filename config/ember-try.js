/* eslint-env node */
module.exports = {
  scenarios: [
    {
      name: 'ember-1.13',
      npm: {
        devDependencies: {
          'ember': '~1.13.0'
        }
      }
    },
    {
      name: 'ember-release',
      npm: {
        devDependencies: {
          'ember': 'release'
        }
      }
    },
    {
      name: 'ember-beta',
      npm: {
        devDependencies: {
          'ember': 'beta'
        }
      }
    },
    {
      name: 'ember-canary',
      allowedToFail: true,
      npm: {
        devDependencies: {
          'ember': 'canary'
        }
      }
    },
    {
      name: 'ember-lts-2.4',
      npm: {
        devDependencies: {
          'ember': 'lts-2-4'
        }
      }
    },
    {
      name: 'ember-lts-2.8',
      npm: {
        devDependencies: {
          'ember': 'lts-2-8'
        }
      }
    }
  ]
};
