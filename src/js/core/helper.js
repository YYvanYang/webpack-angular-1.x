if (typeof Array.prototype.forEach !== 'function') {
    Array.prototype.forEach = function(callback, context) {
        for (var i = 0; i < this.length; i++) {
            callback.apply(context, [ this[i], i, this ]);
        }
    };
}

MapUtilities = {
    hilbert_curve_rotate: function(a, b, c, d, e) {
        return 0 == e && 1 == d && (b = a - 1 - b, c = a - 1 - c), {
            x: c,
            y: b
        }
    },
    calculate_hilbert_curve_distance: function(a, b, c) {
        for (var d = 0, e = 0, f = 0, g = c / 2; g > 0; Math.floor(g /= 2)) {
            d = (a & g) > 0, e = (b & g) > 0, f += g * g * (3 * d ^ e);
            var h = this.hilbert_curve_rotate(g, a, b, d, e);
            a = h.x, b = h.y
        }
        return f
    },
    calculate_euclidean_distance_squared: function(a, b, c, d) {
        return Math.pow(a - c, 2) + Math.pow(b - d, 2)
    },
    calculate_euclidean_distance: function(a, b, c, d) {
        return Math.sqrt(this.calculate_distance_squared(a, b, c, d))
    },
    calculate_centroid: function(a) {
        for (var b = 0, c = 0, d = 0; d < a.length; d++) b += a[d].x, c += a[d].y;
        return {
            x: b / a.length,
            y: c / a.length
        }
    },
    orderPoints: function(a, b) {
        var c = a.concat(b);
        return c = c.sort(function(a) {
            return 8 === a.theme_id ? -1 : 1
        })
    },
    cluster_merge: function(a, b) {
        var c = this.calculate_centroid([{
            x: a.x,
            y: a.y
        }, {
            x: b.x,
            y: b.y
        }]);
        return {
            x: c.x,
            y: c.y,
            projectOfTheMonth: a.points[0].projectOfTheMonth === !0 || b.points[0].projectOfTheMonth === !0,
            projectDisaster: 8 === a.points[0].theme_id || 8 === b.points[0].theme_id,
            slug: a.points[0].project_number.concat("," + b.points[0].project_number),
            points: this.orderPoints(a.points, b.points)
        }
    },
    cluster_hierarchical_agglomerative: function(a, b, c) {
        c = c || 10;
        for (var d = Math.pow(b, 2), e = new Array, f = 0; f < a.length; f++) {
            var g = {
                x: a[f].x,
                y: a[f].y,
                slug: a[f].project_number,
                projectOfTheMonth: a[f].projectOfTheMonth === !0,
                projectDisaster: 8 === a[f].theme_id,
                points: [a[f]]
            };
            e.push(g)
        }
        for (var g = void 0, h = !0, i = 0; h;) {
            for (var j = Array(); void 0 != (g = e.pop());) {
                for (var k = !1, l = -1, m = Number.MAX_VALUE, f = 0; f < e.length; f++) {
                    var n = this.calculate_euclidean_distance_squared(g.x, g.y, e[f].x, e[f].y);
                    d >= n && m > n && (l = f, m = n)
                }
                l >= 0 && (g = this.cluster_merge(g, e[l]), e.splice(l, 1), k = !0), i++, i >= c && (h = !1), j.push(g)
            }
            e = e.concat(j)
        }
        return e
    },
    cluster_hierarchical_agglomerative_hilbert_curve_distance: function(a, b, c, d) {
        c = c || 10, d = d || 10;
        for (var e = new Array, f = 0; f < a.length; f++) {
            var g = {
                x: a[f].x,
                y: a[f].y,
                d: this.calculate_hilbert_curve_distance(a[f].x, a[f].y, d),
                points: [a[f]]
            };
            e.push(g)
        }
        for (var g = void 0, h = !0, i = 0; h;) {
            for (var j = Array(); void 0 != (g = e.pop());) {
                for (var k = !1, l = -1, m = Number.MAX_VALUE, f = 0; f < e.length; f++) {
                    var n = Math.abs(e[f].d - g.d);
                    b >= n && m > n && (l = f, m = n)
                }
                l >= 0 && (g = this.cluster_merge(g, e[l]), g.d = this.calculate_hilbert_curve_distance(g.x, g.y, d), e.splice(l, 1), k = !0), i++, (!k || i >= c) && (h = !1), j.push(g)
            }
            e = e.concat(j)
        }
        return e
    },
    fix_overlapping_points: function(a, b, c, d) {
        c = c || .1, d = d || 10;
        for (var e = Math.pow(b, 2), f = 0; f < a.length; f++)
            for (var g = a[f], h = !1, i = 0;;) {
                h = !1;
                for (var j = 0; j < a.length; j++)
                    if (f != j) {
                        var k = a[j],
                            l = Math.pow(g.x - k.x, 2) + Math.pow(g.y - k.y, 2);
                        if (e >= l) {
                            var m = Math.sqrt(l),
                                n = (g.x - k.x) / m,
                                o = (g.y - k.y) / m,
                                p = Math.ceil((b - m) / 2) + c;
                            g.x = g.x + p * n, g.y = g.y + p * o, k.x = k.x - p * n, k.y = k.y - p * o, h = !0
                        }
                    }
                if (i++, !h || i >= d) break
            }
        return a
    }
};
window.MapUtilities = MapUtilities