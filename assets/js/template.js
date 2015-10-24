function Template(str){
    this.raw = str;
}

Template.prototype = {
    render: function(o){
        return this.raw.replace(/\{([^}]+)\}/g, function(x, $1){
            return o[$1] || $1;
        });
    }
};

