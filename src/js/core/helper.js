if (typeof Array.prototype.forEach !== 'function') {
    Array.prototype.forEach = function(callback, context) {
        for (var i = 0; i < this.length; i++) {
            callback.apply(context, [ this[i], i, this ]);
        }
    };
}