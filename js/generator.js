var Generator = {
    defaultOptions : {
        type: 'reqevery', /* reqevery|pronounceable */
        canUpper: true,
        canLower: true,
        canDigital: true,
        canSpecial: false,
        mindigits: 5,
        length: 12,
        ambig: false
    },
    parseArgs : function (args) {
        var options = {};
        for (var key in this.defaultOptions) {
            if (this.defaultOptions.hasOwnProperty(key)) {
                if (args.hasOwnProperty(key)) {
                    options[key] = args[key];
                }
                else {
                    options[key] = this.defaultOptions[key];
                }
            }
        }
        return options;
    },
    generate:function (args) {
        var options = this.parseArgs(args);

        var minLower = 0;
        var minUpper = 0;
        var minSpecial = 0;

        if(options.canUpper) {
            minUpper = 1;
        }
        if(options.canLower) {
            minLower = 1;
        }
        if(options.canSpecial) {
            minSpecial = 1;
        }
        if (options.type == 'pronounceable') {
            if (options.canUpper )
                return GPW.pronounceablecaps(options.length);
            else
                return GPW.pronounceable(options.length);
        }
        var positions = [];
        if (options.canLower && minLower > 0) {
            for (var i = 0; i < minLower; i++) {
                positions[positions.length] = "L";
            }
        }
        if (options.canUpper && minUpper > 0) {
            for (var i = 0; i < minUpper; i++) {
                positions[positions.length] = "U";
            }
        }
        if (options.canDigital && options.mindigits > 0) {
            for (var i = 0; i < options.mindigits; i++) {
                positions[positions.length] = "D";
            }
        }
        if (options.canSpecial && minSpecial > 0) {
            for (var i = 0; i < minSpecial; i++) {
                positions[positions.length] = "S";
            }
        }
        while (positions.length < options.length) {
            positions[positions.length] = "A";
        }
        positions.sort(function() { return Random.get_random(0, 1) * 2 - 1; });

        // Been burned a few times by this providing special characters...
        var chars = "";
        var lowerChars = "abcdefghjkmnpqrstuvwxyz";
        if (!options.ambig) {
            lowerChars += "ilo";
        }
        if (options.canLower) {
            chars += lowerChars;
        }
        var upperChars = "ABCDEFGHJKMNPQRSTUVWXYZ";
        if (!options.ambig) {
            upperChars += "ILO";
        }
        if (options.canUpper) {
            chars += upperChars;
        }
        var digitChars = "23456789";
        if (!options.ambig) {
            digitChars += "10";
        }
        if (options.canDigital)
            chars += digitChars;
        var specialChars = "!@#$%^&*";
        if (options.canSpecial)
            chars += specialChars;
        var pass = "";
        for(var x=0;x<options.length;x++)
        {
            var useChars;
            switch (positions[x]) {
                case "L": useChars = lowerChars;   break;
                case "U": useChars = upperChars;   break;
                case "D": useChars = digitChars;   break;
                case "S": useChars = specialChars; break;
                case "A": useChars = chars;        break;
            }
            var i = Random.get_random(0, useChars.length - 1);
            pass += useChars.charAt(i);
        }

        return pass;
    }
};