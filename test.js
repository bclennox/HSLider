YAHOO.util.Assert.areEqualArrays = function (expected, actual){
  expected.forEach(function (el, i){
    YAHOO.util.Assert.areEqual(expected[i], actual[i], "Comparing [" + expected.join(", ") + "] with [" + actual.join(", ") + "], failed on index " + i);
  });
};

YAHOO.util.Assert.match = function (expected, actual){
  YAHOO.util.Assert.isTrue(expected.test(actual));
}

function color_suite(){
  var suite = new YAHOO.tool.TestSuite({
    name: "Color",
  });

  function setUp(){
    this.data = Color.instance();
    this.data.preference("compact-hex-values", true);
    this.data.preference("upcase-hex-values", false);
  }

  function tearDown(){
    delete this.data;
  }

  suite.add(new YAHOO.tool.TestCase({
    name: "Hex colors",
  
    _should: {
      error: {
        testInvalidHexCharacters: TypeError,
        testInvalidLengths: TypeError
      }
    },
  
    setUp: setUp,
    tearDown: tearDown,
  
    testSixCharactersWithNoHash: function (){
      var nominal = this.data.set("123456", Color.HEX).nominal();
      YAHOO.util.Assert.areEqualArrays([18, 52, 86], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([210, 65, 20], nominal.hsl);
    },
  
    testSixCharactersWithHash: function (){
      var nominal = this.data.set("#123456", Color.HEX).nominal();
      YAHOO.util.Assert.areEqualArrays([18, 52, 86], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([210, 65, 20], nominal.hsl);
    },
  
    testThreeCharactersWithNoHash: function (){
      var nominal = this.data.set("456", Color.HEX).nominal();
      YAHOO.util.Assert.areEqualArrays([68, 85, 102], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([210, 20, 33], nominal.hsl);
    },
  
    testThreeCharactersWithHash: function (){
      var nominal = this.data.set("#456", Color.HEX).nominal();
      YAHOO.util.Assert.areEqualArrays([68, 85, 102], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([210, 20, 33], nominal.hsl);
    },
  
    testFormattingProperHexString: function (){
      this.data.set("#123456", Color.HEX);
      YAHOO.util.Assert.areEqual("123456", this.data.hex());
      YAHOO.util.Assert.areEqual("#123456", this.data.hex(true));
    },
  
    testFormattingWithCompactPreferenceOff: function (){
      this.data.preference("compact-hex-values", false);
      this.data.set("#def", Color.HEX);
      YAHOO.util.Assert.areEqual("ddeeff", this.data.hex());
      YAHOO.util.Assert.areEqual("#ddeeff", this.data.hex(true));
    },
  
    testFormattingWithCompactPreferenceOn: function (){
      this.data.preference("compact-hex-values", true);
      this.data.set("#def", Color.HEX);
    
      // don't worry about the upcase preference
      YAHOO.util.Assert.areEqual("def", this.data.hex().toLowerCase());
      YAHOO.util.Assert.areEqual("#def", this.data.hex(true).toLowerCase());
    },
  
    testFormattingWithUpcasePreferenceOff: function (){
      this.data.preference("upcase-hex-values", false);
      this.data.set("abcdef", Color.HEX);
      YAHOO.util.Assert.areEqual("abcdef", this.data.hex());
      YAHOO.util.Assert.areEqual("#abcdef", this.data.hex(true));
    },
  
    testFormattingWithUpcasePreferenceOn: function (){
      this.data.preference("upcase-hex-values", true);
      this.data.set("abcdef", Color.HEX);
      YAHOO.util.Assert.areEqual("ABCDEF", this.data.hex());
      YAHOO.util.Assert.areEqual("#ABCDEF", this.data.hex(true));
    },
  
    testInvalidHexCharacters: function (){
      this.data.set("#joe", Color.HEX);
    },
  
    testInvalidLengths: function (){
      this.data.set("#ccee", Color.HEX);
    },
  }));

  suite.add(new YAHOO.tool.TestCase({
    name: "RGB colors",
  
    _should: {
      error: {
        testRedValueOutOfRange: RangeError,
        testGreenValueOutOfRange: RangeError,
        testBlueValueOutOfRange: RangeError,
        testInvalidFormat: TypeError
      }
    },
  
    setUp: setUp,
    tearDown: tearDown,
  
    testValuesInRangeWithCommas: function (){
      var nominal = this.data.set("12, 34, 56", Color.RGB).nominal();
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([210, 65, 13], nominal.hsl);
    },
  
    testValuesInRangeWithoutCommas: function (){
      var nominal = this.data.set("12 34 56", Color.RGB).nominal();
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([210, 65, 13], nominal.hsl);
    },
  
    testFormatting: function (){
      this.data.set("12, 34, 56", Color.RGB);
      YAHOO.util.Assert.areEqual("12, 34, 56", this.data.rgb());
      YAHOO.util.Assert.areEqual("rgb(12, 34, 56)", this.data.rgb(true));
    },
  
    testRedValueOutOfRange: function (){
      this.data.set("256, 0, 0", Color.RGB);
    },
  
    testGreenValueOutOfRange: function (){
      this.data.set("0, 257, 0", Color.RGB);
    },
  
    testBlueValueOutOfRange: function (){
      this.data.set("0, 0, 258", Color.RGB);
    },
  
    testInvalidFormat: function (){
      this.data.set("0, 0", Color.RGB);
    },
  }));

  suite.add(new YAHOO.tool.TestCase({
    name: "HSL colors",
  
    _should: {
      error: {
        testHueValueOutOfRange: RangeError,
        testSaturationValueOutOfRange: RangeError,
        testLightnessValueOutOfRange: RangeError,
        testInvalidFormat: TypeError
      }
    },
  
    setUp: setUp,
    tearDown: tearDown,
  
    testValuesInRangeWithCommas: function (){
      var nominal = this.data.set("12, 34, 56", Color.HSL).nominal();
      YAHOO.util.Assert.areEqualArrays([181, 120, 105], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], nominal.hsl);
    },
  
    testValuesInRangeWithoutCommas: function (){
      var nominal = this.data.set("12 34 56", Color.HSL).nominal();
      YAHOO.util.Assert.areEqualArrays([181, 120, 105], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], nominal.hsl);
    },
  
    testValuesInRangeWithPercents: function (){
      var nominal = this.data.set("12 34% 56%", Color.HSL).nominal();
      YAHOO.util.Assert.areEqualArrays([181, 120, 105], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], nominal.hsl);
    },
  
    testFormatting: function (){
      this.data.set("12, 34, 56", Color.HSL);
      YAHOO.util.Assert.areEqual("12, 34, 56", this.data.hsl());
      YAHOO.util.Assert.areEqual("hsl(12, 34%, 56%)", this.data.hsl(true));
    },
  
    testHueValueOutOfRange: function (){
      this.data.set("361 0 0", Color.HSL);
    },
  
    testSaturationValueOutOfRange: function (){
      this.data.set("0 101 0", Color.HSL);
    },
  
    testLightnessValueOutOfRange: function (){
      this.data.set("0 0 102", Color.HSL);
    },
  
    testInvalidFormat: function (){
      this.data.set("0 0", Color.HSL);
    },
  
    testIgnoreUnnecessaryConversions: function (){
    
      // rounding errors cause slight adjustments in RGB and HSL values
      // even when setting them to what they already appear to be
      var nominal = this.data.set("ccee88", Color.HEX).nominal();
      YAHOO.util.Assert.areEqualArrays([204, 238, 136], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([80, 75, 73], nominal.hsl);
    
      nominal = this.data.set("80, 75, 73", Color.HSL).nominal();
      YAHOO.util.Assert.areEqualArrays([204, 238, 136], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([80, 75, 73], nominal.hsl);
    
      nominal = this.data.set("ccee88", Color.HEX).nominal();
      YAHOO.util.Assert.areEqualArrays([204, 238, 136], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([80, 75, 73], nominal.hsl);
    
      nominal = this.data.set("204 238 136", Color.RGB).nominal();
      YAHOO.util.Assert.areEqualArrays([204, 238, 136], nominal.rgb);
      YAHOO.util.Assert.areEqualArrays([80, 75, 73], nominal.hsl);
    },
  }));
  
  return suite;
}

function gradient_suite(){
  var suite = new YAHOO.tool.TestSuite({
    name: "Gradient",
  });

  suite.add(new YAHOO.tool.TestCase({
    name: "Gradient",

    setUp: function (){
      this.data = new Gradient();
    },
    
    tearDown: function (){
      delete this.data;
    },
    
    testToStringWithNoStops: function (){
      YAHOO.util.Assert.isUndefined(this.data.toString());
    },
    
    testAddingStops: function (){
      this.data.stop(0, '#111');
      this.data.stop(0.50, '#444');
      this.data.stop(1, '#999');
      
      var s = this.data.toString();
      YAHOO.util.Assert.match(/0, #111/, s);
      YAHOO.util.Assert.match(/0.5, #444/, s);
      YAHOO.util.Assert.match(/1, #999/, s);
    },
    
    testSettingHslViaConstructor: function (){
      var g = new Gradient([12, 34, 56]);
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], g.hsl());
    },
    
    testSettingHslViaColorObject: function (){
      var c = new Color();
      c.set("12 34 56", Color.HSL);
      
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], this.data.hsl(c));
    },
    
    testSettingHslViaArray: function (){
      YAHOO.util.Assert.areEqualArrays([12, 34, 56], this.data.hsl([12, 34, 56]));
    },
    
    testCssForSaturation: function (){
      this.data.hsl([12, 34, 56]);
      
      var s = this.data.css(Gradient.SATURATION);
      YAHOO.util.Assert.match(/0, hsl\(12, 0%, 56%\)/, s);
      YAHOO.util.Assert.match(/0.2, hsl\(12, 20%, 56%\)/, s);
      YAHOO.util.Assert.match(/1, hsl\(12, 100%, 56%\)/, s);
    },
    
    testCssForLightness: function (){
      this.data.hsl([12, 34, 56]);
      
      var s = this.data.css(Gradient.LIGHTNESS);
      YAHOO.util.Assert.match(/0, hsl\(12, 34%, 0%\)/, s);
      YAHOO.util.Assert.match(/0.2, hsl\(12, 34%, 20%\)/, s);
      YAHOO.util.Assert.match(/1, hsl\(12, 34%, 100%\)/, s);
    },
  }));
  
  return suite;
}

function adjustor_suite(){
  var suite = new YAHOO.tool.TestSuite({
    name: "Adjustor",
  });
  
  // fake Event objects
  var up = { keyCode: Adjustor.UP, preventDefault: function (){} };
  var down = { keyCode: Adjustor.DOWN, preventDefault: function (){} };
  
  function nudge(expected, direction, cursor, format, modifier){
    cursor = cursor || 0;
    format = format || Color.RGB;
    
    if (modifier){
      direction.altKey = true;
    }
    
    this.data.selectionStart = cursor;
    Adjustor.nudge(this.data, direction, format);
    YAHOO.util.Assert.areEqual(expected, this.data.value);
  }
  
  function setUp(){
    this.data = { value: "12, 34, 56", selectionStart: 0 };
  }
  
  function tearDown(){
    delete this.data;
  }

  suite.add(new YAHOO.tool.TestCase({
    name: "Positions",
    
    setUp: setUp,
    tearDown: tearDown,

    testNudgingPosition0: function (){
      nudge.call(this, "13, 34, 56", up, 0);
    },

    testNudgingPosition1: function (){
      nudge.call(this, "13, 34, 56", up, 1);
    },

    testNudgingPosition2: function (){
      nudge.call(this, "13, 34, 56", up, 2);
    },

    testNudgingPosition3: function (){
      nudge.call(this, "12, 34, 56", up, 3);
    },

    testNudgingPosition4: function (){
      nudge.call(this, "12, 35, 56", up, 4);
    },

    testNudgingPosition10: function (){
      nudge.call(this, "12, 34, 57", up, 10);
    },
  }));
  
  suite.add(new YAHOO.tool.TestCase({
    name: "Directions",
    
    setUp: setUp,
    tearDown: tearDown,
    
    testNudgingUp: function (){
      nudge.call(this, "12, 35, 56", up, 4);
    },

    testNudgingWayUp: function (){
      nudge.call(this, "12, 44, 56", up, 4, null, true);
    },
    
    testNudgingDown: function (){
      nudge.call(this, "12, 33, 56", down, 4);
    },

    testNudgingWayDown: function (){
      nudge.call(this, "12, 24, 56", down, 4, null, true);
    },
  }));
  
  suite.add(new YAHOO.tool.TestCase({
    name: "Range checking",
    
    setUp: setUp,
    tearDown: tearDown,
    
    testNudgingRGBUpOutOfRange: function (){
      this.data.value = "255, 34, 56";
      nudge.call(this, "255, 34, 56", up, 0);
    },

    testNudgingRGBDownOutOfRange: function (){
      this.data.value = "0, 34, 56";
      nudge.call(this, "0, 34, 56", down, 0);
    },
    
    testNudgingHueUpOutOfRange: function (){
      this.data.value = "359, 34, 56";
      nudge.call(this, "359, 34, 56", up, 0, Color.HSL);
    },
    
    testNudgingHueDownOutOfRange: function (){
      this.data.value = "0, 34, 56";
      nudge.call(this, "0, 34, 56", down, 0, Color.HSL);
    },
    
    testNudgingSaturationUpOutOfRange: function (){
      this.data.value = "12, 100, 56";
      nudge.call(this, "12, 100, 56", up, 4, Color.HSL);
    },
    
    testNudgingSaturationDownOutOfRange: function (){
      this.data.value = "12, 0, 56";
      nudge.call(this, "12, 0, 56", down, 4, Color.HSL);
    },
    
    testNudgingLightnessUpOutOfRange: function (){
      this.data.value = "12, 34, 100";
      nudge.call(this, "12, 34, 100", up, 8, Color.HSL);
    },
    
    testNudgingLightnessDownOutOfRange: function (){
      this.data.value = "12, 34, 0";
      nudge.call(this, "12, 34, 0", down, 8, Color.HSL);
    },
  }));
  
  return suite;
}

window.addEventListener("load", function (){
  var logger = new YAHOO.tool.TestLogger("log");
  
  YAHOO.tool.TestRunner.add(color_suite());
  YAHOO.tool.TestRunner.add(gradient_suite());
  YAHOO.tool.TestRunner.add(adjustor_suite());
  YAHOO.tool.TestRunner.run();
});
