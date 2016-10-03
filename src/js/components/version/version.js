'use strict';

angular.module('jm-np.version', [
  'jm-np.version.interpolate-filter',
  'jm-np.version.version-directive'
])

.value('version', '0.1');
