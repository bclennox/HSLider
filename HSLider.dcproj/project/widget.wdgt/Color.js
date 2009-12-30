Array.prototype.inject = function (memo, iterator){
  for (var i = 0, j = this.length - 1; j >= 0; i++, j--){
    memo = iterator.call(this, memo, this[i], i);
  };
  
  return memo;
}

/**
 * Provides a singleton-like Color.instance() method, but still allows
 * creating new instances with new Color() as well. This is intentional.
 */
function Color(){
  
  
  /*** Private instance variables ***/
  
  
  // RGB and HSL color values
  var nominal = {
    rgb: [0, 0, 0],
    hsl: [0, 0, 0]
  };
  
  // preferences
  var prefs = {
    "compact-hex-values": true,     // use compact hex strings (e.g., "#aabbcc" => "#abc")
    "upcase-hex-values": false      // use uppercase characters in hex strings
  }
  
  // used in hex conversion methods
  var chars = "0123456789abcdef";
  
  
  /*** Private instance methods ***/
  
  
  /**
   * Converts a decimal number to a hex string, but only for values less
   * than 255 because I'm lazy.
   *
   * @param int
   * @return string
   */
  function dec2hex(dec){
    dec = Math.min(Math.max(Math.round(dec), 0), 255);
    return "" + chars[Math.floor(dec / 16)] + chars[dec % 16];
  }
  
  /**
   * Converts a hex string to a decimal number.
   *
   * @param string
   * @return int
   */
  function hex2dec(hex){
    return hex.toString().split("").inject(0, function (sum, ch, i){
      return sum + (chars.indexOf(ch) * Math.pow(16, hex.length - i - 1));
    });
  }
  
  /**
   * Converts an RGB value (an array of [R, G, B] integers) to HSL (an array
   * of [H, S, L] integers).
   *
   * @param array
   * @return array
   */
  function rgb2hsl(rgb){
    
    // http://en.wikipedia.org/wiki/HSL_and_HSV#Formal_specifications
    var r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    
    var h;
    if (max == min){
      h = 0;
    } else if (max == r){
      h = (60 * ((g - b) / (max - min)) + 360) % 360;
    } else if (max == g){
      h = 60 * ((b - r) / (max - min)) + 120;
    } else {
      h = 60 * ((r - g) / (max - min)) + 240;
    }
    
    var l = (max + min) / 2;
    
    var s;
    if (max == min){
      s = 0;
    } else if (l < 1/2){
      s = (max - min) / (max + min);
    } else {
      s = (max - min) / (2 - max - min);
    }
    
    return [h, s * 100, l * 100].map(Math.round);
  }
  
  /**
   * Converts an HSL value (an array of [H, S, L] integers) to RGB (an array
   * of [R, G, B] integers).
   *
   * @param array
   * @return array
   */
  function hsl2rgb(hsl){
    
    // http://en.wikipedia.org/wiki/HSL_and_HSV#Formal_specifications
    var h = hsl[0] / 360,
        s = hsl[1] / 100,
        l = hsl[2] / 100,
        q = l < 1/2 ? l * (1 + s) : l + s - (l * s),
        p = 2 * l - q;
    
    return [h + 1/3, h, h - 1/3].map(function (c){
      c = c < 0 ? c + 1 : c > 1 ? c - 1 : c;
      
      var f;
      if (c < 1/6){
        f = p + ((q - p) * 6 * c);
      } else if (c < 1/2){
        f = q;
      } else if (c < 2/3){
        f = p + ((q - p) * 6 * (2/3 - c));
      } else {
        f = p;
      }
      
      return Math.round(f * 255);
    });
  }
  
  /**
   * Converts a color value in one of the three recognized formats to
   * a normalized format and updates the nominal value of this color as
   * a side effect.
   *
   * Returns the new nominal value (a hash with keys "rgb" and "hsl").
   *
   * @param string or array
   * @param class constant
   * @return hash
   */
  function normalize(value, format){
    
    var spec;
    switch (format){
      case Color.HEX: spec = { key: "rgb", converter: parsehex }; break;
      case Color.RGB: spec = { key: "rgb", converter: parsergb }; break;
      case Color.HSL: spec = { key: "hsl", converter: parsehsl }; break;
      default: throw new TypeError("Invalid color format: " + format);
    }
    
    var parsed = spec.converter(value);
    if (parsed[spec.key].toString() != nominal[spec.key].toString()){
      nominal = parsed;
    }
    
    return nominal;
  }
  
  /**
   * Parses a hex string and returns the RGB and HSL equivalents as a "nominal" hash.
   *
   * @param string
   * @return hash
   */
  function parsehex(value){
    if (!value.match(/^#?(?:[0-9A-Fa-f]{3})(?:[0-9A-Fa-f]{3})?$/)){
      throw new TypeError("Invalid hex string: " + value)
    }
    
    var hex = value.replace(/^#/, "").toLowerCase();
    
    if (hex.length == 3){
      hex = hex.replace(/^(.)(.)(.)$/, "$1$1$2$2$3$3");
    }
    
    var rgb = hex.match(/(..)/g).map(hex2dec);
    
    return { rgb: rgb, hsl: rgb2hsl(rgb) };
  }
  
  /**
   * Parses an RGB array and returns the RGB and HSL equivalents as a "nominal" hash.
   *
   * @param array
   * @return hash
   */
  function parsergb(value){
    var rgb = chunk(value);
    
    if (rgb.length != 3){
      throw new TypeError("Invalid RGB string: " + value);
    } else {
      rgb.forEach(function (c, i){
        if (c < 0 || c > 255){
          throw new RangeError(["Red", "Green", "Blue"][i] + " value in " + value + " out of range [0, 255]: " + c);
        }
      });
    }
    
    return { rgb: rgb, hsl: rgb2hsl(rgb) };
  }
  
  /**
   * Parses an HSL array and returns the RGB and HSL equivalents as a "nominal" hash.
   *
   * @param array
   * @return hash
   */
  function parsehsl(value){
    var hsl = chunk(value);
    
    if (hsl.length != 3){
      throw new TypeError("Invalid HSL string: " + value);
    } else {
      if (hsl[0] < 0 || hsl[0] >= 360){
        throw new RangeError("Hue value in " + value + " out of range [0, 360): " + hsl[0]);
      }
      
      if (hsl[1] < 0 || hsl[1] > 100){
        throw new RangeError("Saturation value in " + value + " out of range [0, 100]: " + hsl[1]);
      }

      if (hsl[2] < 0 || hsl[2] > 100){
        throw new RangeError("Lightness value in " + value + " out of range [0, 100]: " + hsl[2]);
      }
    }
    
    return { rgb: hsl2rgb(hsl), hsl: hsl };
  }
  
  /**
   * Attempts to match three integers in a string and returns them in
   * an array. Separators are unimportant.
   *
   * @param string
   * @return array
   */
  function chunk(rgb_or_hsl_string){
    return rgb_or_hsl_string.match(/(\d+)/g).slice(0, 3);
  }


  /*** Public instance methods ***/
  
  
  /**
   * Retrieves a preference value. If a key and value are passed as arguments,
   * sets the preference first, and then returns it.
   *
   * @param string
   * @param anything
   * @return anything
   */
  this.preference = function (key, value){
    if (typeof prefs[key] != "undefined" && typeof value != "undefined"){
      prefs[key] = value;
    }
    
    return prefs[key];
  };
  
  /**
   * Sets the nominal value of this color in a given format. Returns the
   * instance so you can chain another method call if you like (even though
   * that method probably can't chain).
   *
   * @param string
   * @param class constant
   * @return this
   */
  this.set = function (value, format){
    normalize(value, format);
    return this;
  };
  
  /**
   * Returns the nominal value of this color as a hash with keys "rgb" and "hsl".
   *
   * @return hash
   */
  this.nominal = function (){
    return nominal;
  }
  
  /**
   * Proxy to hex(), rgb(), and hsl() methods. Pass the name of the method
   * as a string. This just seems safer than Color[method_name]().
   *
   * @param string
   * @return string
   */
  this.fetch = function (format){
    if (typeof this[format] == "function"){
      return this[format].apply(this, Array.prototype.slice.call(arguments).slice(1));
    }
  };
  
  /**
   * Returns the hex value of this color as a string. Pass a boolean indicating
   * whether to format the return value as valid CSS.
   *
   * @param boolean
   * @return string
   */
  this.hex = function (css){
    var hex = nominal.rgb.map(dec2hex).join("");
    
    hex = this.preference("upcase-hex-values") ? hex.toUpperCase() : hex.toLowerCase();
    
    if (this.preference("compact-hex-values")){
      hex = hex.replace(/^(.)\1(.)\2(.)\3$/, "$1$2$3");
    }
    
    return (css ? "#" : "") + hex;
  };
  
  /**
   * Returns the RGB value of this color as a string. Pass a boolean indicating
   * whether to format the return value as valid CSS.
   *
   * @param boolean
   * @return string
   */
  this.rgb = function (css){
    return (css ? "rgb(" : "") + nominal.rgb.join(", ") + (css ? ")" : "");
  };
  
  /**
   * Returns the HSL value of this color as a string. Pass a boolean indicating
   * whether to format the return value as valid CSS.
   *
   * @param boolean
   * @return string
   */
  this.hsl = function (css){
    var hsl = nominal.hsl;
    
    if (css){
      hsl[1] += "%";
      hsl[2] += "%";
    }
    
    return (css ? "hsl(" : "") + hsl.join(", ") + (css ? ")" : "");
  };
  
  /**
   * Same as this.hex(true).
   *
   * @return string
   */
  this.toString = function (){
    return this.hex(true);
  };
};


/*** Class constants and methods ***/


// use these to indicate the format of the value passed to set() and stuff
Color.HEX = "hex";
Color.RGB = "rgb";
Color.HSL = "hsl";

/**
 * Returns the singleton instance of the Color class. But it's not really
 * a Singleton.
 *
 * @return Color
 */
Color.instance = function (){
  if (Color._instance == undefined){
    Color._instance = new Color();
  }
  
  return Color._instance;
};
