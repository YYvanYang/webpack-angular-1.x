/* global toastr:false, moment:false */
(function() {
    'use strict';

    var toastr = require('../../dep/toastr/toastr.js');

    angular
        .module('app.core')
        .constant('toastr', toastr);
})();
