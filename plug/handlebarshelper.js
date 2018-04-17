Handlebars.registerHelper('json', function (context) {
    return JSON.stringify(context)
})

Handlebars.registerHelper('isImgFile', function (v1, v2, v3) {
    var result
    result = /jpg$|jpeg$|png$|gif$/.test(v1) ? v1 + v2 : v3
    return 'src="' + result + '"'
})

Handlebars.registerHelper('showHref', function (v1) {
    var result
    result = /jpg$|jpeg$|png$|gif$/.test(v1) ? v1 : 'javascript:;'
    return 'href="' + result + '"'
})

Handlebars.registerHelper('getYMD', function (content) {
    return content.split(' ')[0]
})

Handlebars.registerHelper('isSelected', function (v1, v2) {
    if (v1 == v2) {
        return ' selected'
    } else {
        return ''
    }
})

Handlebars.registerHelper('test', function (v1, v2) {
    if (v2.indexOf(v1) > -1) {
        return arguments[arguments.length - 1].fn()
    }
})

Handlebars.registerHelper('isPicSelected', function (value, arr) {
    var real = []
    for (var i = 0; i < arr.length; i++) {
        real.push(arr[i].real)
    }
    if (real.indexOf(value) > -1 || real.indexOf(' ' + value) > -1) {
        return 'isSelected'
    } else {
        return ''
    }
})

Handlebars.registerHelper('select', function (value, options) {
    var $el = $('<select />').html(options.fn(this));
    $el.find('[value="' + value + '"]').attr({
        'selected': 'selected'
    });
    return $el.html();
});

Handlebars.registerHelper('checked', function (values, options) {
    var $el = $('<div>').html(options.fn(this));
    if (values) {
        for (var index = 0; index < values.length; index++) {
            var value = values[index];
            $el.find('[value="' + value + '"]').attr({
                'checked': 'checked'
            });
        }
    }
    return $el.html();
});

Handlebars.registerHelper('addIndex', function (value) {
    return value + 1
});

Handlebars.registerHelper('courseFilter', function (ptCourseList, options) {
    var $el = $('<div>').html(options.fn(this));
    if (ptCourseList) {
        var arr = []
        for (var i = 0; i < ptCourseList.length; i++) {
            arr.push('' + ptCourseList[i].courseId)
        }
        for (i = $el.find('[uid]').length ; i > -1; i--) {
            if (arr.indexOf($($el.find('[uid]')[i]).attr('uid')) > -1) {
                $($el.find('[uid]')[i]).remove()
            }
        }
    }
    return $el.html();
});

Handlebars.registerHelper('getName', function (value, values) {
    for (var i = 0; i < values.length; i++) {
        if (values[i].id == value) {
            break
        }
    }
    return values[i].name
});
Handlebars.registerHelper('mmdd', function (value, options) {
    if (value) {
        return value.substring(5)
    }
});
Handlebars.registerHelper('yymmdd', function (value, options) {
    if (value) {
        return value.substring(0, 10)
    }
});
Handlebars.registerHelper('greaterThan', function (v1, v2, options) {
    var $el = $('<div>').html('');
    if (v2 > v1) {
        $el.html(v1 + '-' + v2)
    } else {
        $el.html(v1)
    }
    return $el.html();
});
Handlebars.registerHelper("if2", function (v1, v2, v3, options) {
    var ret,
        val = options.fn(this),
        inverse = options.inverse(this);

    switch (v2) {
        case "==":
        case "===":
            ret = (v1 === v3 ? val : inverse);
            break;
        case ">":
            ret = (v1 > v3 ? val : inverse);
            break;
        case "<":
            ret = (v1 < v3 ? val : inverse);
            break;
        case ">=":
            ret = (v1 >= v3 ? val : inverse);
            break;
        case "<=":
            ret = (v1 <= v3 ? val : inverse);
            break;
        case "!=":
            ret = (v1 != v3 ? val : inverse);
            break;

    }
    return ret;
})

Handlebars.registerHelper('forIndex', function (value, options) {
    var index = parseInt(value) + 1
    return index;
})

Handlebars.registerHelper("if", function (v1, symbol, v2, options) {
    var result
    if (typeof symbol !== 'string') {
        options = symbol
        var conditional = v1
        if (Handlebars.Utils.isFunction(conditional)) {
            conditional = conditional.call(this);
        }

        if ((!options.hash.includeZero && !conditional) || Handlebars.Utils.isEmpty(conditional)) {
            result = options.inverse(this);
        } else {
            result = options.fn(this);
        }
    } else {
        switch (symbol) {
            case '==':
                result = (v1 == v2 ? options.fn(this) : options.inverse(this))
                break;
            case "===":
                result = (v1 === v2 ? options.fn(this) : options.inverse(this))
                break;
            case ">":
                result = (v1 > v2 ? options.fn(this) : options.inverse(this))
                break;
            case "<":
                result = (v1 < v2 ? options.fn(this) : options.inverse(this))
                break;
            case "!=":
                result = (v1 != v2 ? options.fn(this) : options.inverse(this))
                break;
        }
    }
    return result
})

Handlebars.registerHelper('toFixed', function (v, digits, option) {
    var result
    if (!v) {
        result = ''
    } else {
        if (typeof digits === 'number') {
            result = v.toFixed(digits)
        } else {
            result = v.toFixed(2)
        }
    }
    return result;
})
