(function($) {
  window.camelize = function(text) {
    try {
      return text.replace(/^([A-Z])|[\s-_\.]+(\w)/g, function(
        match,
        p1,
        p2,
        offset
      ) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
      });
    } catch (error) {
      return '';
    }
  };
  window.generateID = function(prefix, suffix) {
    try {
      let abc = 'a,b,c,d,e,f,g,h,ch,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z'.split(
        ','
      );
      prefix =
        prefix && (typeof prefix === 'string' || typeof prefix === 'number')
          ? prefix
          : abc[Math.floor(Math.random() * (abc.length - 0) + 0)];
      suffix =
        suffix && (typeof suffix === 'string' || typeof suffix === 'number')
          ? suffix
          : '';
      return `${prefix}${new Date().getTime()}${suffix}`
        .replace(/\ /g, '')
        .replace(/\b\d+/gi, '');
    } catch (error) {
      return false;
    }
  };

  window.timeStriToMs = function(string) {
    try {
      if (!/^[\d\.]{1,}(s|ms)$/gi.test(string)) return null;

      let timeUnit = string.match(/(s|ms)$/gi)[0],
        multiple = timeUnit === 's' ? 1000 : 1;

      return parseFloat(string) * multiple;
    } catch (error) {
      console.warn(error);
      return null;
    }
  };

  window.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : {
          r: 0,
          g: 0,
          b: 0
        };
  };

  window.accordionHeight = function(accordionContentWrapperElement) {
    try {
      clearTimeout(window.accordionHeightTimeout);
    } catch (error) {}
    window.accordionHeightTimeout = setTimeout(function() {
      accordionContentWrapperElement =
        arguments.length > 0
          ? accordionContentWrapperElement
          : '.accordion-content-wrapper';
      $(accordionContentWrapperElement).each((ind, el) => {
        let t = $(el),
          possibleHeight,
          style = `.accordion-slide.is-active #${el.id} {
        max-height: {{maxheight}}px
      }
        .accordion-slide:focus-within #${el.id} {
        max-height: {{maxheight}}px
      }`,
          styleEl = $('<style/>');
        //set it's width to suppoerted minimum
        // t.css({
        //   width: 320
        // })
        // get the scrollHeight
        possibleHeight = t.get(0).scrollHeight;
        // create a style element with it's own id and max height
        style = style.replace(/\{\{maxheight\}\}/gi, possibleHeight);
        styleEl.text(style);
        // remove elements width back to normal
        // t.css({
        //   width: ''
        // })
        t.closest('.accordion-slide')
          .find(' > style')
          .remove();
        // prepend style element to content wrapper
        t.before(styleEl);
      });
    }, 100);
  };

  $('body').on('mouseup', e => {
    let t = $(e.target);
    if (
      !t.is('form *:not(button), input, textarea, select, [contenteditable]')
    ) {
      t.trigger('blur');
    }
  });
})(Cog.jQuery());
// returns array with unique values
Array.prototype.unique = function() {
  return this.filter(function(value, index, self) {
    return self.indexOf(value) === index;
  });
};

Array.prototype.removeEmptyStrings = function() {
  return this.filter(function(value, index, self) {
    return /\b ?$/g.test(value.toString());
  });
};
