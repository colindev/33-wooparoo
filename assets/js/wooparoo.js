(function(){

    function in_array(item, arr){
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] == item) {
                return true;
            }
        }

        return false;
    }

    function Wooparoo(json){
        this.data = json;
    }

    Wooparoo.prototype = {
        each: function(func){
            for (var name in this.data) {
                func(this.data[name], name);
            }
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
        }
    };

    self.Wooparoo = Wooparoo;
})();
