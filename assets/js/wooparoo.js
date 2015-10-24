(function(){

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

                if ( ! prop) return;
                if (prop.pop && in_array(val, prop)) matched = true;
                if (prop == val) matched = true;
                
                if (matched) slice[name] = item;
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
        }
    };

    self.Wooparoo = Wooparoo;
})();
