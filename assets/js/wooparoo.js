(function(){

    var prop_bin = {
        '冰': 1,
        '水': 1 << 1,
        '木': 1 << 2,
        '土': 1 << 3,
        '火': 1 << 4,
        '雷': 1 << 5,
        '風': 1 << 6,
        '魔法': 1 << 7
    },
    bin_prop = {};

    for (var n in prop_bin) {
        bin_prop[prop_bin[n]] = n;
    }

    function in_array(item, arr){
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == item) {
                return true;
            }
        }

        return false;
    }

    function isSpecail(prop) {
        switch (prop) {
            case '光明':
            case '黑暗':
            case '黃金':
                return true;

            default:
                return false;
        }
    }

    function Wooparoo(json){
        var me = this;
        this.data = json;
    }

    Wooparoo.prototype = {
        each: function(func){
            for (var name in this.data) {
                if ( ! name) continue;
                func(this.data[name], name);
            }
        },
        get: function(name){
            return this.data[name];
        },
        find: function(prop_name, val){
            var slice = {};

            this.each(function(item, name){
                var prop = item[prop_name],
                    matched = false;
                
                if ( ! name) return;
                if ( ! prop) return;
                if (prop.pop && in_array(val, prop)) matched = true;
                if (prop == val) matched = true;
                
                if (matched) slice[name] = item;
            });

            return slice;
        },
        bin: function(o){
            if (typeof o == 'string') o = this.name2props(o);

            return this.props2bin(o);
        },
        bin2props: function(i){
            var x = 0,
                max = 6,
                ret = [],
                k;

            while (x <= max) {
                k = 1 << x;
                if (i & k) ret.push(bin_prop[k]);
                x++;
            }

            return ret;
        },
        name2props: function(name){
            var item = this.get(name);
            return item && item['屬性'] || []; 
        },
        props2bin: function(props){
            var bin = 0;
            var i = props.length;
            while (i--) {
                bin |= prop_bin[props[i]] || 0;
            }
            return bin;
        },
        isComposeEnable: function(n1, n2){
            var p1 = this.name2props(n1),
                p2 = this.name2props(n2),
                b1 = this.props2bin(p1),
                b2 = this.props2bin(p2);

            if ( ! p1.length || ! p2.length) return false;
            if (p1.length == 1 && p2.length == 1 && (b1 ^ b2) == 0) return false;

            switch (b1 + b2) {
                // 冰木
                case 5:
                // 冰火
                case 17:
                // 土風
                case 72:
                // 水雷
                case 34:
                    return false;
            }

            return true;
        },
        isStar: function(prop){
            switch (prop) {
                case '光明':
                case '黑暗':
                case '黃金':
                    return true;
            }

            return false;
        },
        rareMatch: function(name){
            var m = 0, args = arguments;
            for (var i = 1, len = args.length; i < len; i++) {
                if (args[i]['稀有']) m++;
            }

            switch (name) {
                case '天使龍': return 0 == m;
                case '影龍': return 0 == m;
                case '黑暗龍': return 2 <= m;
                case '黃金龍': return 1 <= m;
                case '獅身鷲': return 1 <= m;
            }
            return false;
        },
        propMatch: function(name, b1, b2){
            var n = this.bin2props(b1 ^ b2).length;
            switch (name) {
                case '天使龍': return 4 <= n;
                case '影龍': return 4 <= n;
                case '黑暗龍': return 2 <= n;
                case '黃金龍': return 4 <= n;
                case '獅身鷲': return 4 <= n;
            }
            return false;
        },
        findByProps: function(arr){
            var slice = {},
                prop;

            for (var i = 0, len = arr.length; i < len; i++) {
                prop = arr[i];
                this.each(function(item, name){
                    if (in_array(prop, item['屬性'])) slice[name] = item;
                });
            }

            return slice;
        },
        findByPropsExact: function(arr){
            var slice = {},
                len = arr.length;
            this.each(function(item, name){
                var cnt = item['屬性'].length;

                if ( ! name) return;
                if (cnt != len) return;

                for (var i = 0; i < len; i++) {
                    if (in_array(arr[i], item['屬性'])) cnt--;
                }
                //if (0 === cnt) console.log(arr, item['屬性'], cnt);
                if (0 === cnt) slice[name] = item;
            });
            return slice;
        },       
        hasProp: function(name, prop){
            if (this.data[name] && this.data[name]['屬性']) {
                var props = this.data[name]['屬性'];
                if (isSpecail(prop)) return in_array(prop, props);
                for (var i = 0, len = props.length; i < len; i++) {
                    if (isSpecail(props[i])) return true;
                    if (prop == props[i]) return true;
                }
            }

            return false;
        },
        mixable: function(name){
            if ( ! this.data[name]) return false;
            return ! this.data[name]['備註'] || ! this.data[name]['備註'].match(/無法合成/);
        }
    };

    self.Wooparoo = Wooparoo;
})();
