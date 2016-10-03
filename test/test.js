// require('../src/dep/angular/angular')
// require('../src/dep/angular-route/angular-route')
// require('../src/dep/angular-mocks/angular-mocks')

var testsContext = require.context(".", true, /_test$/);
testsContext.keys().forEach(testsContext);