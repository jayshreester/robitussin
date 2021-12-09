window.offset = el => {
  return {
    left: el.getBoundingClientRect().left + window.scrollX,
    top: el.getBoundingClientRect().top + window.scrollY
  };
};
window.bpHashChangeHandler = e => {
  try {
    let hash = decodeURIComponent(window.location.hash),
      actionExists = !!bpComponents.bpActions[hash.replace(/#/g, '')],
      elementExists = (() => {
        try {
          return document.querySelectorAll(hash).length > 0;
        } catch (error) {
          return false;
        }
      })(),
      element,
      elementOffset,
      userOffset = (() => {
        try {
          let ret = 0;
          document
            .querySelector('[class*="offsetscroll-"]')
            .classList.forEach(el => {
              if (el.indexOf('offsetscroll') > -1) ret = el.split('-')[1];
            });
          return ret;
        } catch (error) {
          return 0;
        }
      })(), // set offset for page by adding offset-{num in px} to body element
      navOffset = document.querySelector(
        window.innerWidth < 768
          ? '.megamenu-bottom-center'
          : '.megamenu-nav-container'
      ).offsetHeight;

    if (actionExists) {
      try {
        e.preventDefault();
        bpComponents.bpActions[hash.replace(/#/g, '')]();
      } catch (error) {
        console.warn(error);
      }
    }

    if (elementExists) {
      e.preventDefault();
      element = document.querySelector(hash);
      elementOffset = offset(element);
      document.body.style.scrollBehavior = document.documentElement.style.scrollBehavior =
        'smooth';

      document.documentElement.scrollTop =
        elementOffset.top - navOffset - userOffset;
    }
  } catch (error) {
    console.warn(error);
  }
};

if (!window.bpComponents) {
  window.bpComponents = {
    version: '2.6',
    getNavigationType: function() {
      try {
        let simple = document.querySelectorAll('.simple-navigation').length > 0,
          mega = document.querySelectorAll('.megamenu-navigation').length > 0,
          error =
            document.querySelectorAll('.megamenu-navigation.simple-navigation')
              .length > 0,
          none =
            document.querySelectorAll(
              '.megamenu-navigation, .simple-navigation'
            ).length === 0;

        return none
          ? 'Not set'
          : error
          ? 'Wrongly set (both)'
          : simple
          ? 'SimpleNavigation'
          : mega
          ? 'MegaNavigation'
          : 'Not set';
      } catch (error) {
        return 'Error getting info';
      }
    },
    switchNavigation: type => {
      // type:String - 'megamenu' or 'simple'
      // this is just for debuging
      let nav = window.bpComponents.getNavigationType(),
        navNode,
        search,
        rep,
        re;

      if (nav === 'MegaNavigation') {
        navNode = document.querySelector('.megamenu-navigation');
        rep = 'simple';
        search = 'megamenu';
      }
      if (nav === 'SimpleNavigation') {
        navNode = document.querySelector('.simple-navigation');
        rep = 'megamenu';
        search = 'simple';
      }
      if (
        nav === 'Not set' ||
        nav === 'Wrongly set (both)' ||
        nav === 'Error getting info'
      ) {
        navNode = document.querySelector('.reference-megamenu');
        rep = '';
      }

      re = new RegExp(`\ ?${search}\-navigation`, 'g');
      type = type ? type : rep;

      navNode.className = `${navNode.classList
        .toString()
        .replace(re, '')} ${type}-navigation`.replace(/ $/g, '');
    },
    componentsNameMap: {
      accordions: 'Accordion     ',
      bpFilters: 'Filter      ',
      bpTogglers: 'Togglers      ',
      bpLoaders: 'Content Loader',
      bpCarousels: 'Carousel     ',
      bpSharers: 'Sharer     ',
      bpShareContainers: 'Share Container',
      bpVideoPlayers: 'Video Player',
      tables: 'Table       ',
      bpActions: 'Action Component',
      rtRegContainers: 'RevTrax Register Container'
    },
    accordions: {}, // accordions, if accordion missing class idclass-{{yourid}} it won't be registered
    bpFilters: {}, // bp filter components
    bpLoaders: {}, // bp loader components, content loaders are registered after initializations, if content loader is set to init after it's in viewport only then it will be registered to this object
    bpCarousels: {}, // bp carousels components
    bpFontResizer: {}, // bp resizer component, since all font resizers working together as one, this object will have only setter method to set font size programatically ie. bpComponents.bpFontResizer.setFontSize('default')  available values:STRING are 'default', 'large', 'larger'
    bpSharers: {}, // bp sharer components
    bpShareContainers: {}, // bp share container components
    bpVideoPlayers: {}, // bp video player components
    tables: {}, // bp table components
    bpActions: {}, // bp action components
    rtRegContainers: {}, // bp rev trex register components
    bpMegaMenu: {}, // megamenu component,
    bpTogglers: {}, // megamenu component,
    bpTrackers: {}, // used GTMTrackers

    getUsedComponents: function(component) {
      if (arguments.length > 0 && typeof arguments[0] === 'string') {
        if (/filter/gi.test(component)) component = '.class-filter';
        if (/toggler/gi.test(component)) component = '.toggler-container';
        if (/font|resizer/gi.test(component)) component = '.bp-font-resizer';
        if (/megamenu|menu|mega/gi.test(component)) component = '.megamenu';
        if (/player|video|videoplayer/gi.test(component))
          component = '.bpplayer';
        if (/sharer|share|sharelink|social/gi.test(component))
          component = '.jv-share-link';
        if (
          !/filter|font|resizer|megamenu|menu|mega|player|video|videoplayer|sharer|share|sharelink|social|toggler/gi.test(
            component
          )
        )
          component = `.component.${component}`;

        let res = document.querySelectorAll(component);
        console.log(res);
        return res;
      }
      const usedCustomComponents = ['Registered custom components:'],
        usedCFComponents = [
          'Ued CF components:',
          `Box          \t\t\t\t${
            document.querySelectorAll('.component.box').length
          }`,
          `Image        \t\t\t\t${
            document.querySelectorAll('.component.image').length
          }`,
          `RichText     \t\t\t\t${
            document.querySelectorAll('.component.richText').length
          }`,
          `Title        \t\t\t\t${
            document.querySelectorAll('.component.title').length
          }`,
          `Breadcrumbs  \t\t\t\t${
            document.querySelectorAll('.component.breadcrumbs').length
          }`,
          `Parametrized HTML\t\t\t${
            document.querySelectorAll(
              '.component.advancedParametrizedHtml, .component.parametrizedhtml'
            ).length
          }`,
          `Navigation  \t\t\t\t${
            document.querySelectorAll('.component.navigation').length
          }`,
          `Snippet Reference\t\t\t${
            document.querySelectorAll('.component.snippetReference').length
          }`
        ];
      for (i in this) {
        if (
          this.hasOwnProperty(i) &&
          i !== 'componentsNameMap' &&
          i !== 'getUsedComponents' &&
          i !== 'bpFontResizer' &&
          i !== 'version' &&
          i !== 'isIE' &&
          i !== 'ieVersion' &&
          i !== 'bpMegaMenu'
        ) {
          if (Object.keys(this[i]).length > 0 && this[i].constructor === Object)
            usedCustomComponents.push(
              `${this.componentsNameMap[i]}\t\t\t\t${
                Object.keys(this[i]).length
              }`
            );
        }
      }

      console.log(
        this.bpMegaMenu.itemsCount > 0
          ? `Megamenu:     \t\t\t\t1\nMenu Items:     \t\t\t${
              this.bpMegaMenu.itemsCount
            }\nMenu Type:     \t\t\t\t${this.getNavigationType()}\nDropdowns:     \t\t\t\t${
              this.bpMegaMenu.dropDowns
            }\n\tused:     \t\t\t\t${
              this.bpMegaMenu.dropDownsUsed
            }\n\tunused:     \t\t\t${this.bpMegaMenu.dropDownsUnUsed}`
          : `Megamenu:     \t\t\t\t0`
      );
      console.log(
        usedCustomComponents.length < 1
          ? 'No custom components are used'
          : usedCustomComponents.join(`\n`)
      );
      console.log(usedCFComponents.join(`\n`));
    }
  };
  window.bpComponents.bpMegaMenu.navigationType = window.bpComponents.getNavigationType();
}

window.addEventListener('hashchange', bpHashChangeHandler, true);
window.addEventListener(
  'load',
  e => {
    try {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (error) {}
  },
  true
);
