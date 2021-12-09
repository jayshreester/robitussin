/*eslint-disable*/
($ => {
  // comment / uncomment trakers to exclude / include trackers from site
  // to add a new tracker create a new record in Array and create tracker at the end of the file
  const includedTrackers = [];

  //GTMTracker class
  class GTMTracker {
    static error = (msg, id) => {
      console.warn(`GTMTracker: ${msg}. In ${id}`);
    };

    static initCheck = ['eventTrigger'];
    #maxScrolled = 0;
    #config = {
      id: `gtmtracker${new Date().getTime() +
        Math.floor(Math.random() * (1000 * 1000))}`,
      eventCategory: 'Unspecified category',
      eventAction: '',
      eventTrigger: null,
      eventLabel: 'Unspecified label',
      eventTargetSelector: '',
      eventTargetClosestSelector: '',
      eventTargetParentSelector: '',
      eventTargetSharerSelector: '',
      eventTargetChildSelector: '',
      eventDelay: 0,
      pushOnce: false,
      keepMaxScroll: false,
      debug: false
    };
    #ready = false;

    constructor(config = {}) {
      Object.assign(this.#config, config);
      Object.keys(this.#config).forEach(key => {
        Object.defineProperty(this, key, {
          get: function() {
            return this.#config[key];
          },
          set: function(value) {
            this.#config[key] = value;
          }
        });
      });

      return this;
    }

    closest = (element, selector) => {
      if (typeof selector !== 'string') return false;
      let current = element;
      while (current !== document.documentElement) {
        if (current.matches(selector)) return current;
        current = current.parentElement;
      }
      return null;
    };

    getData = baseElement => {
      let cfg = this.#config,
        dlObject = {
          event: 'customEvent',
          eventCategory: cfg.eventCategory,
          eventAction: cfg.eventAction,
          eventLabel: cfg.eventLabel
        },
        dlObjectStringified = JSON.stringify(dlObject),
        eventIndex =
          typeof this.eventIndex === 'number' ? this.eventIndex : false;
      if (
        typeof baseElement.matches !== 'function' &&
        cfg.eventTrigger === 'scroll'
      ) {
        baseElement = window;
      }

      if (!baseElement) {
        GTMTracker.error('No base element specified!', cfg.id);
        return false;
      }

      /*
       ** create object with macros
       ** each property represents macro
       ** {{propertyName}}
       */

      //  console.log(baseElement !== window)
      let link = window !== baseElement ? baseElement.getAttribute('href') : '',
        eh =
          baseElement !== window
            ? baseElement.offsetHeight
            : window.innerHeight,
        sh =
          (baseElement !== window
            ? baseElement.scrollHeight
            : document.documentElement.scrollHeight) - eh,
        st = baseElement !== window ? baseElement.scrollTop : window.scrollY,
        percScroll = (st / sh) * 100;

      this.#maxScrolled =
        this.#maxScrolled > percScroll && cfg.keepMaxScroll
          ? this.#maxScrolled
          : percScroll;

      let parent =
          cfg.eventTargetParentSelector !== '' && window !== baseElement
            ? this.closest(baseElement, cfg.eventTargetParentSelector)
            : null,
        sharer =
          parent !== null && cfg.eventTargetSharerSelector !== ''
            ? parent.querySelector(cfg.eventTargetSharerSelector)
            : null,
        child =
          cfg.eventTargetChildSelector !== ''
            ? baseElement.querySelector(cfg.eventTargetChildSelector)
            : null,
        baseElementIsElement =
          baseElement !== null && typeof baseElement.matches === 'function',
        macros = {
          text: baseElement.textContent,
          link: link,
          fullInternalLink: !/https?:\/\/(www\.)?/gim.test(link)
            ? `${window.location.protocol}://${window.location.hostname}${link}`
            : link,
          pageUrl: window.location.href,
          hostName: window.location.hostname,
          rootUrl: `${window.location.protocol}://${window.location.hostname}`,
          sharerText: sharer !== null ? sharer.textContent : 'null',
          parentText: parent !== null ? parent.textContent : 'null',
          parentTitle: parent !== null ? parent.getAttribute('title') : 'null',
          sharerTitle: sharer !== null ? sharer.getAttribute('title') : 'null',
          childTitle: child !== null ? child.getAttribute('title') : 'null',
          childText: child !== null ? child.textContent : 'null}',
          childLink:
            child !== null && typeof child.getAttribute('href') !== 'undefined'
              ? child.getAttribute('href')
              : 'null',
          scrollTop: baseElement.scrollTop,
          scrollTopPercentage: `${this.#maxScrolled.toFixed(2)}%`,
          accordionOpenedClosed: baseElementIsElement
            ? (() => {
                return baseElement.matches('.is-active') ? 'open' : 'close';
              })()
            : 'null',
          filterSelectedLabel: baseElementIsElement
            ? (() => {
                return baseElement.dataset.label;
              })()
            : 'null',
          articleType: () => {
            try {
              return parent.classList
                .toString()
                .match(/article-tracker-([^\s]+)/i)[1];
            } catch (err) {
              return '';
            }
          },
          productType: () => {
            try {
              return parent.classList
                .toString()
                .match(/products-tracker-([^\s]+)/i)[1];
            } catch (err) {
              return '';
            }
          },
          email: () => {
            try {
              return baseElement
                .getAttribute('href')
                .match(
                  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                )[0];
            } catch (error) {
              return '';
            }
          },
          phone: () => {
            try {
              return baseElement.getAttribute('href').replace(/tel\:/gi, '');
            } catch (error) {
              return '';
            }
          },
          dropdownParentText: () => {
            try {
              return parent.matches('.megamenu-submenu-item')
                ? parent.getAttribute('data-link-title')
                : parent.previousSibling.textContent;
            } catch (error) {
              return '';
            }
          },
          filterStatus: () => {
            try {
              return this.closest(baseElement, '.filter-container-js').matches(
                '.opened-js'
              )
                ? 'open'
                : 'close';
            } catch (error) {
              return '';
            }
          }
        };
      // loop through macros and replace every occurance in given string
      Object.entries(macros).forEach(entry => {
        if (typeof entry[1] === 'undefined' || entry[1] === null) return;
        let re = new RegExp(`\{\{${entry[0]}\}\}`, 'igm');
        entry[1] =
          typeof entry[1].trim === 'function' ? entry[1].trim() : entry[1];
        dlObjectStringified = dlObjectStringified.replace(re, entry[1]);
      });
      // return converted string
      return {
        pushObject: JSON.parse(dlObjectStringified),
        eventIndex: eventIndex
      };
    };

    enable = () => {
      this.disabled = false;
    };

    disable = () => {
      this.disabled = true;
    };

    process = (element, isLink, link, external) => {
      if (this.disabled) {
        return;
      }
      this.disable();
      setTimeout(() => {
        this.enable();
      }, 1);
      if (
        typeof dataLayer !== 'object' ||
        !Array.isArray(dataLayer) ||
        (dataLayer && !dataLayer.hasOwnProperty('push'))
      )
        return;

      let cfg = this.#config,
        globalDebug = document.querySelectorAll('.gtm-debug').length > 0;

      if (globalDebug || cfg.debug === true) cfg.debug = true;
      else cfg.debug = false;

      if (cfg.pushOnce && !this.uniquieEventId && !this.eventIndex) {
        this.uniquieEventId =
          dataLayer[dataLayer.length - 1]['gtm.uniqueEventId'];
        this.eventIndex = dataLayer.length - 1;
      }

      let data = this.getData(element);

      if (isLink && typeof link === 'string' && !external && !cfg.debug) {
        data.pushObject.eventCallback = function() {
          if (element.matches('a[target="_blank"]')) window.open(link);
          else window.location = link;
        };
      }

      if (!globalDebug) {
        if (data.eventIndex) {
          dataLayer[data.eventIndex] = data.pushObject;
        } else {
          dataLayer.push(data.pushObject);
        }
      }

      if (cfg.debug) console.log(JSON.stringify(data.pushObject, null, 2));
    };

    init = () => {
      let cfg = this.#config,
        canInit = true;

      if (this.#ready) {
        GTMTracker.error('Already initiated!', cfg.id);
        return this;
      }

      GTMTracker.initCheck.forEach(entry => {
        if (!cfg || cfg[entry] === null) {
          GTMTracker.error(`${entry} not specified!`, cfg.id);
          canProcess = false;
          return;
        }
      });

      if (!canInit) return this;

      window.addEventListener(
        cfg.eventTrigger,
        e => {
          if (
            typeof dataLayer !== 'object' ||
            !Array.isArray(dataLayer) ||
            (dataLayer && !dataLayer.hasOwnProperty('push'))
          ) {
            if (typeof window._gtm_error_warned !== 'boolean') {
              console.warn(
                'dataLayer is not present but GTMTracker is set! Please either turn off GTMTracker or setup GTM on this page!'
              );
              window._gtm_error_warned = true;
            }
            return;
          }
          let isAnchor, t, matched, isElement, external, hashLink;

          t = e.target;
          try {
            if (
              t.matches(
                '.navigation-item-decoration, .navigation-item-decoration *'
              )
            )
              return;
          } catch (error) {
            // console.warn(error)
            // return
          }

          isElement = typeof t.matches === 'function';
          matched = isElement && t.matches(`${cfg.eventTargetSelector}`);
          t = matched ? this.closest(t, cfg.eventTargetClosestSelector) : t;
          isAnchor = isElement && t.matches('a[href]');
          hashLink =
            isElement && isAnchor && t.matches('a[href^="#"]') ? true : false;
          external = isAnchor && t.matches('.external');

          if (cfg.debug || (isAnchor && !hashLink)) e.preventDefault();

          if (matched && !t.delayed && cfg.eventTrigger !== 'scroll') {
            if (cfg.eventDelay > 0) {
              setTimeout(() => {
                this.process(t, isAnchor, t.getAttribute('href'), external);
              }, cfg.eventDelay);
            } else {
              this.process(t, isAnchor, t.getAttribute('href'), external);
            }
          }

          if (
            cfg.eventTrigger === 'scroll' &&
            cfg.eventTargetSelector === 'body'
          ) {
            setTimeout(() => {
              this.process(t);
            }, cfg.eventDelay);
          }
        },
        true
      );

      this.#ready = true;
      return this;
    };
  }

  GTMTracker.debug = () => {
    if (document.body.matches('.gtm-debug')) {
      document.body.classList.remove('gtm-debug');
      Object.entries(window.bpComponents.bpTrackers).forEach(
        entry => (entry[1].debug = false)
      );
    } else document.body.classList.add('gtm-debug');
  };

  $(document).ready(e => {
    /*
     ** CONTENT PAGE TYPES
     */

    /*
     ** HOME PAGE / UNIVERSAL / GLOBAL CONTENT LINKS AND COMPONENTS
     */

    // Did a user read the whole page / how far has a user scrolled?
    // track max user scroll progres on a page no class needed
    bpComponents.bpTrackers.scrollTracker = new GTMTracker({
      id: 'scrollTracker',
      eventCategory: 'scroll depth',
      eventAction: 'User scrolled up to {{scrollTopPercentage}} of page',
      eventTrigger: 'scroll',
      eventTargetSelector: 'body',
      pushOnce: true,
      keepMaxScroll: true
    }).init();

    // Did a user click any internal links not outlined elsewhere in this document?
    // tracks all internal links click - no class needed
    bpComponents.bpTrackers.internalLinksTracker = new GTMTracker({
      id: 'internalLinksTracker',
      eventCategory: 'internal links',
      eventAction: '{{text}}',
      eventTrigger: 'click',
      eventLabel: '{{fullInternalLink}}',
      eventTargetSelector:
        'a[href]:not(.external):not([href^="#"]), a:not(.external):not([href^="#"]) *',
      eventTargetClosestSelector: 'a'
    }).init();

    // Did a user click any external links not outlined elsewhere in this document?
    // tracks all external links, no class needed
    bpComponents.bpTrackers.externalLinksTracker = new GTMTracker({
      id: 'externalLinksTracker',
      eventCategory: 'external links',
      eventAction: '{{text}}',
      eventTrigger: 'click',
      eventLabel: '{{link}}',
      eventTargetSelector: 'a.external, a.external *',
      eventTargetClosestSelector: 'a'
    }).init();

    // Did a user click any promoted new/related/suggested/recommended articles?
    // Category: article links action: {{new/related/suggested/recommended}} label: {{article title}}
    //TBD
    bpComponents.bpTrackers.relatedArticlesTracker = new GTMTracker({
      id: 'relatedArticlesTracker',
      eventCategory: 'article links action',
      eventAction: '{{articleType}}',
      eventTrigger: 'click',
      eventTargetChildSelector: 'figcaption',
      eventTargetParentSelector: '.box[class*="article-tracker-"]',
      eventLabel: '{{childText}}',
      eventTargetSelector:
        '.box[class*="article-tracker-"] .image, .box[class*="article-tracker-"] .image *',
      eventTargetClosestSelector: '.box[class*="article-tracker-"] .image'
    }).init();

    // Did a user click any promoted new/related/suggested/recommended products?
    // Category: product links action: {{new/related/suggested/recommended}} label: {{product name}}
    // TBD
    bpComponents.bpTrackers.relatedProductsTracker = new GTMTracker({
      id: 'relatedProductsTracker',
      eventCategory: 'product links action',
      eventAction: '{{productType}}',
      eventTrigger: 'click',
      eventTargetChildSelector: '.product-card-subtitle',
      eventTargetParentSelector: '.box[class*="products-tracker-"]',
      eventLabel: '{{childText}}',
      eventTargetSelector:
        '.box[class*="products-tracker-"] .product-card, .box[class*="products-tracker-"] .product-card *:not(.btn):not(.compare-button)',
      eventTargetClosestSelector:
        '.box[class*="products-tracker-"] .product-card'
    }).init();

    // Did a user click to learn more about an alternate content type (such as a benefit or ingredient)?
    // Category: article links action: {{benefit/ingredient}} label: {{benefit/ingredient name}}
    // TBD
    // bpComponents.bpTrackers.alterContentTracker = new GTMTracker({
    //   id: 'alterContentTracker',
    //   eventCategory: 'external links',
    //   eventAction: '{{text}}',
    //   eventTrigger: 'click',
    //   eventLabel: '{{link}}',
    //   eventTargetSelector:
    //     '.track-related-articles a, .track-related-articles a *',
    //   eventTargetClosestSelector: '.track-related-articles a'
    // }).init()

    // Was there a form validation error?
    // Category: error action: form submission error: {{form name}} label: {{form field(s)}}
    // TBD
    // bpComponents.bpTrackers.formValidationTracker = new GTMTracker({
    //   id: 'formValidationTracker',
    //   eventCategory: 'external links',
    //   eventAction: '{{text}}',
    //   eventTrigger: 'click',
    //   eventLabel: '{{link}}',
    //   eventTargetSelector:
    //     '.track-related-articles a, .track-related-articles a *',
    //   eventTargetClosestSelector: '.track-related-articles a'
    // }).init()

    // Was a promotional banner clicked? - promotional-banner-tracker class should be added to component used for banner
    // Category: banner action: {{banner name}} label: {{CTA/button text}}
    // TBD
    bpComponents.bpTrackers.promotionalBannerTracker = new GTMTracker({
      id: 'promotionalBannerTracker',
      eventCategory: 'banner',
      eventAction: '{{childText}}',
      eventTrigger: 'click',
      eventLabel: '{{sharerText}}',
      eventTargetSelector:
        '.promotional-banner-tracker, .promotional-banner-tracker *',
      eventTargetClosestSelector: '.promotional-banner-tracker',
      eventTargetChildSelector: '.richText-content > p:nth-child(1)',
      eventTargetParentSelector: '.promotional-banner-tracker',
      eventTargetSharerSelector: '.richText-content > p:nth-child(2)'
    }).init();

    /*
     ** ARTICLE HUB / LIST PAGE (HUB)
     */

    // Did a user select an article category?
    // Category: article links action: category selection label: {{category}}
    // article-hub-category-tracker class shoud be added to nav component
    bpComponents.bpTrackers.articleHubCateoryTracker = new GTMTracker({
      id: 'articleHubCateoryTracker',
      eventCategory: 'article links',
      eventAction: 'category selection',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector:
        '.article-hub-category-tracker a, .article-hub-category-tracker a *',
      eventTargetClosestSelector: '.article-hub-category-tracker a'
    }).init();

    // Which article did a user click (from the standard list)?
    // Category: article links action: list selection label: {{article name}}
    bpComponents.bpTrackers.articleShowContainerTracker = new GTMTracker({
      id: 'articleShowContainerTracker',
      eventCategory: 'article links',
      eventAction: 'list',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector:
        '.article-show-container .image a, .article-show-container .image a *',
      eventTargetClosestSelector: '.article-show-container .image a'
    }).init();

    /*
     ** PRODUCT LIST PAGE (HUB)
     */

    // Did a user click on a product category/type? Which one?
    // Category: product links action: {{category/type}} selection  label: {{category/type text selected}}
    bpComponents.bpTrackers.productCategoryTracker = new GTMTracker({
      id: 'productCategoryTracker',
      eventCategory: 'product links',
      eventAction: '{{text}}',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector:
        '.product-category-tabs-tracker a, .product-category-tabs-tracker a *',
      eventTargetClosestSelector: '.product-category-tabs-tracker a'
    }).init();

    // Did a user go to a product detail page? Which one?
    // Category: product links action: list selection label: {{product name}}
    // product-list-tracker class have to be added to product list box even filter results if aplicable
    bpComponents.bpTrackers.productListCardTracker = new GTMTracker({
      id: 'productListCardTracker',
      eventCategory: 'product',
      eventAction: 'list selection',
      eventTrigger: 'click',
      eventLabel: '{{childText}}',
      eventTargetSelector:
        '.product-list-tracker .product-card, .product-card *:not(.btn):not(.compare-button)',
      eventTargetClosestSelector: '.product-card',
      eventTargetChildSelector: '.product-card-subtitle'
    }).init();

    /*
     ** PRODUCT DETAIL PAGE
     */

    // Did a user click ‘buy now’?
    // Category: where to buy action: buy now label: {{product name}}
    bpComponents.bpTrackers.buyNowBtnTracker = new GTMTracker({
      id: 'buyNowBtnTracker',
      eventCategory: 'where to buy',
      eventAction: 'buy now',
      eventTrigger: 'click',
      eventLabel: '{{sharerText}}',
      eventTargetSelector: '.btn[ps-sku], .btn[ps-sku] *',
      eventTargetClosestSelector: '.btn[ps-sku]',
      eventTargetParentSelector: '.product-card, .product-detail-top-block',
      eventTargetSharerSelector:
        '.product-detail-top-block h1, .product-card .product-card-subtitle'
    }).init();

    // Did a user try to get a coupon?
    // category: coupons action: get coupon label: {{coupon name}}
    bpComponents.bpTrackers.buyNowBtnTracker = new GTMTracker({
      id: 'buyNowBtnTracker',
      eventCategory: 'coupons',
      eventAction: 'get coupon',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector: '.get-cupon-link a, .get-cupon-link a *',
      eventTargetClosestSelector: '.get-cupon-link a'
    }).init();

    // Did a user leave a review?
    // category: reviews action: submission label: {{product name}}

    // Was a product rated?
    // category: reviews action: {{rating}} label: {{product name}}

    // Did a user watch the video?
    // category: videos action: {{video action}} label: {{video name}}

    // Did a user check a specific tab?
    // category: product links action: detail tab label: {{tab name}}
    bpComponents.bpTrackers.productDetailTabTracker = new GTMTracker({
      id: 'productDetailTabTracker',
      eventCategory: 'product links',
      eventAction: 'detail tab',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector:
        '.product-detail-top-block + .tabs .tabs-nav a, .product-detail-top-block + .tabs .tabs-nav a *',
      eventTargetClosestSelector:
        '.product-detail-top-block + .tabs .tabs-nav a'
    }).init();

    /*
     ** CONTACT
     */

    // Did a user try to email GSK
    // Covered with Brilliant Basics for all ‘mailto’ links
    // category: mailto links action: email address click label: {{page URL}}
    bpComponents.bpTrackers.contactMailLinkTracker = new GTMTracker({
      id: 'contactMailLinkTracker',
      eventCategory: 'mailto links',
      eventAction: 'email address {{email}}',
      eventTrigger: 'click',
      eventLabel: '{{pageUrl}}',
      eventTargetSelector: 'a[href^="mailto:"], a[href^="mailto:"] *',
      eventTargetClosestSelector: 'a[href^="mailto:"]'
    }).init();

    // Did a user try to call GSK
    // If one phone number listed: covered by Brilliant Basics (pending feature) for all ‘tel’ links
    // category: telephone links action: phone number click label: {{page URL}}
    bpComponents.bpTrackers.contactPhoneLinkTracker = new GTMTracker({
      id: 'contactPhoneLinkTracker',
      eventCategory: 'telephone links',
      eventAction: 'phone number {{phone}}',
      eventTrigger: 'click',
      eventLabel: '{{pageUrl}}',
      eventTargetSelector: 'a[href^="tel:"], a[href^="tel:"] *',
      eventTargetClosestSelector: 'a[href^="tel:"]'
    }).init();

    // If multiple phone numbers listed:
    // category: telephone links action: phone number click label: {{country, language or other unique  identifier (that isn’t the actual phone number)}}

    // Did a user complete a form to contact GSK
    // category: contact us action: form submit label: {{page URL}}

    // Did a user subscribe to an email list
    // category: email action: opt in label: {{page URL}}

    /*
     ** FAQs
     */

    // Did a user filter the FAQs with specific categories (where available)?
    // category: faq links action: category selection label: {{category}}

    // Did a user open / close any of the questions?
    // category: faq action: {{open/close}} label: {{question text}}

    // Did a user follow through to an article page?
    // Category: article links action: faq click label: {{article name}}

    // Did a user follow through to a product page?
    // Category: product links action: faq click label: {{product name}}

    /*
     ** FUNCTIONALITY
     */

    /*
     ** NAVIGATION (HEADER AND FOOTER)
     */

    // Did a user click the brand or GSK logo?
    // Category: navigation action: header label: {{brand name/GSK}} logo

    // Did a user click an item in the top navigation menu?
    // Category: navigation action: header label: {{link text}}
    bpComponents.bpTrackers.topNavigationTracker = new GTMTracker({
      id: 'topNavigationTracker',
      eventCategory: 'navigation',
      eventAction: 'header',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector:
        '.megamenu-main-nav > .component-content > .navigation-root > li > a, .megamenu-main-nav > .component-content > .navigation-root > li > a *',
      eventTargetClosestSelector:
        '.megamenu-main-nav > .component-content > .navigation-root > li > a'
    }).init();

    // Did a user click an item in the sub navigation menu?
    // Category: navigation action: header label: {{top navigation text}}:{{link text}}
    bpComponents.bpTrackers.topSubNavigationTracker = new GTMTracker({
      id: 'topSubNavigationTracker',
      eventCategory: 'navigation',
      eventAction: 'header',
      eventTrigger: 'click',
      eventLabel: '{{dropdownParentText}}:{{text}}',
      eventTargetParentSelector: 'ul.navigation-level2, .megamenu-submenu-item',
      eventTargetSharerSelector:
        '.megamenu-main-nav > .component-content > .navigation-root > li > a',
      eventTargetSelector:
        '.megamenu-main-nav navigation-level2 a, .megamenu-submenu-item a, .megamenu-main-nav navigation-level2 a *,  .megamenu-submenu-item a *',
      eventTargetClosestSelector:
        '.megamenu-main-nav navigation-level2 a, .megamenu-submenu-item a'
    }).init();

    // Did a user click the hamburger menu icon?
    // Category: navigation action: hamburger label: click
    bpComponents.bpTrackers.hamburgerTracker = new GTMTracker({
      id: 'hamburgerTracker',
      eventCategory: 'navigation',
      eventAction: 'hamburger',
      eventTrigger: 'click',
      eventLabel: 'click',
      eventTargetSelector:
        '.navigation-mobile-menu:not(.opened),.navigation-mobile-menu:not(.opened) *',
      eventTargetClosestSelector: '.navigation-mobile-menu'
    }).init();

    // Did a user click ‘back to top’ ?
    // Category: navigation action: back to top label: {{page URL}}

    // Did a user select a different country?
    // Category: navigation action: country select label: {{country}}
    bpComponents.bpTrackers.countrySelectTracker = new GTMTracker({
      id: 'countrySelectTracker',
      eventCategory: 'navigation',
      eventAction: 'country select',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector:
        '.megamenu-language-list a, .megamenu-language-list a *',
      eventTargetClosestSelector: '.megamenu-language-list a'
    }).init();

    // Did a user select a different country with separate language links?
    // Category: navigation action: country select label: {{country}}:{{language}

    // Did a user select a different language (for a multilingual site without changing country)?
    // Category: navigation action: language select label: {{language}}

    // Did a user click on the footer navigation
    // Category: navigation action: footer label: {{link text}}
    bpComponents.bpTrackers.footerNavTracker = new GTMTracker({
      id: 'footerNavTracker',
      eventCategory: 'navigation',
      eventAction: 'footer',
      eventTrigger: 'click',
      eventLabel: '{{text}}',
      eventTargetSelector:
        '.footer-navigation-tracker a, .footer-navigation-tracker a *',
      eventTargetClosestSelector: '.footer-navigation-tracker a'
    }).init();

    /*
     ** CAROUSEL
     */

    // Was a carousel banner clicked?
    // category: carousel interaction action: carousel banner click label: {{banner position}}:{{banner name}} //dev note: position is numerical position of banner

    // Was a carousel indicator (dots below banner) clicked?
    // category: carousel interaction action: carousel indicator click label: {{indicator position}} //dev note: numerical position of the indicator

    // Was the carousel manually advanced/switched (arrow click or swipe)?
    // category: carousel interaction action: carousel transition label: {{transition type}} //arrow left, arrow right, swipe left, swipe right

    /*
     ** PRODUCT FILTER (EXCLUDING PRODUCT CATEGORY SELECTION)
     */

    // Did the user show/hide filter options?
    // category: product filter action: filter display toggle  label: {{show/hide}}
    bpComponents.bpTrackers.productFilterToggleTracker = new GTMTracker({
      id: 'productFilterToggleTracker',
      eventCategory: 'product',
      eventAction: 'filter display toggle',
      eventTrigger: 'click',
      eventLabel: '{{filterStatus}}',
      eventTargetSelector:
        '.product-filter .filter-container-js, .product-filter .filter-container-js *',
      eventTargetClosestSelector: '.product-filter .filter-container-js',
      eventDelay: 1
    }).init();

    // Did the user select a product property by which to filter?
    // category: product filter action: filter select  label: {{filter category/heading(if applicable)}}:{{filter text}}
    bpComponents.bpTrackers.productFilterSelectTracker = new GTMTracker({
      id: 'productFilterSelectTracker',
      eventCategory: 'product',
      eventAction: 'filter display toggle',
      eventTrigger: 'click',
      eventLabel: '{{filterStatus}}',
      eventTargetSelector:
        '.product-filter .filter-container-js, .product-filter .filter-container-js *',
      eventTargetClosestSelector: '.product-filter .filter-container-js',
      eventDelay: 1
    }).init();

    // Did the user deselect a product property by which to filter?
    // category: product filter action: filter deselect  label: {{filter category/heading(if applicable)}}:{{filter text}}

    // Did the user toggle a filter category/heading?
    // category: product filter action: category toggle  label: {{filter category/heading(if applicable)}}:{{show/hide}}

    /*
     ** INGREDIENTS LANDING FILTER
     */

    // Did the user select a filter from the dropdown?
    // category: article links action: ingredient filter  label: {{name of filter/category selected}}

    /*
     ** COUPONS / VOUCHERS
     */

    // Was a coupon printed/downloaded? Which coupon?
    // category: coupons action: print label: {{coupon name}}

    // Did a user immediately leave the site after generating a coupon?
    // metric: exit % (on the coupon print/download page)

    /*
     ** WHERE TO BUY
     */

    // Did a user click a ‘buy now’ link or button specific to a product?
    // Category: where to buy action: buy now label: {{product name}}

    // Did a user click the “buy local/find nearby” or “buy online/find online” tab?
    // category: where to buy action: tab select label: {{tab name}}

    // Did a user select a product , variant and pack size from the dropdown?
    // category: where to buy action: product select label: {{product name}} - {{product variant}} - {{product pack size}}

    // Did a user click on an online retailer (link to external site)?
    // category: where to buy action: select online retailer label: {{retailer name}}

    // Was a search for the nearest retailer performed?
    // category: where to buy action: retailer search label: results: {{number of results}}

    // Did a user click to enable geolocation ?
    // category: where to buy action: retailer search label: enable geolocation

    // Did a user click on a local retailer (after searching)?
    // category: where to buy action: select local retailer label: {{retailer name}}

    // Did a user click to get Google maps directions to a local retailer (when this functionality exists)
    // category: where to buy action: get directions label: {{retailer name}}

    // Did a user click to call a local retailer (when this functionality exists)
    // category: where to buy action: click to call label: {{retailer name}}

    /*
     ** PRODUCT COMPARISON
     */

    // Did a user add a product to compare (click compare button in product box or on compare page in either position)
    // Category: product comparison action: product selected label: {{product name}}
    bpComponents.bpTrackers.compareButtonTracker = new GTMTracker({
      id: 'compareButtonTracker',
      eventCategory: 'product comparison',
      eventAction: 'product selected',
      eventTrigger: 'click',
      eventTargetSharerSelector: '.product-card-subtitle',
      eventTargetParentSelector: '.product-card',
      eventLabel: '{{sharerText}}',
      eventTargetSelector: '.compare-button, .compare-button *',
      eventTargetClosestSelector: '.compare-button'
    }).init();

    // Which two products did a user compare?
    // Category: product comparison action: products compared label: {{product 1}} vs. {{product 2}}

    /*
     ** VIDEOS
     */

    // Was the video watched, and which one?
    // category: videos action: {{video action}} label: {{video name}}

    // How much of the video was watched?
    // category: videos action: {{video action}} label: {{video name}}

    // What categories of videos are being watched?
    // category: videos action: {{video category}} label: {{video name}}

    /*
     ** PRODUCT REVIEWS AND RATINGS
     */

    // Was a product rated?
    // category: product ratings action: {{product name}} label: {{rating}}

    // Was a review submitted and what was the sentiment?
    // category: product reviews action: review submission label: {{product name}}:{{positive/neutral/negative}}

    // Was a review flagged?
    // category: product reviews action: flagged review label: {{review id}}

    /*
     ** ARTICLE RATINGS
     */

    // Was an article rated?
    // category: article ratings action: {{article title}} label: {{rating}}

    /*
     ** SOCIAL
     */

    // Was a page shared to a social media network?
    // category: social share action: {{social media network}} label: {{page URL}}

    // Did a user click a link to a GSK social property?
    // category: external links action: {{click text}} label: {{click URL}}

    /*
     ** SITE SEARCH
     */

    // What terms were searched?
    // Covered with out of the box GA dimension:
    // dimension: search term
    // How many results were delivered?
    // category: site search action: {{search term}} label: results: {{# of results}}

    // Were any results clicked on? Which one?
    // category: site search action: {{search term}} label: selected: {{clicked URL}}

    /*
     ** ACCOUNT CREATION
     */

    // Did a user create an account?
    // category: account action: register label: {{user id}}

    // Did a user login? Logout?
    // category: account action: {{login/logout}} label: {{user id}}

    /*
     ** STEP BY STEP QUIZ / PRODUCT FINDER WHERE THE USER
     ** ANSWERS A SERIES OF QUESTIONS THAT CONCLUDE IN RELEVANT RESULTS
     */

    // Did a user start the quiz?
    // category: {{name of quiz/tool}} action: start label: {{page URL}}

    // How many questions did a user complete and how did they answer?
    // category: {{name of quiz}} action: {{question #}}: {{question}} label: {{answer(s) selected}}

    // Did a user complete the full quiz and what were the results?
    // category: {{name of quiz}} action: completed label: {{result(s)}}

    // Did a user click on “buy now” after completing the quiz (results page)?
    // See ‘buy now’ click under ‘Where to buy’ functionality

    // Did a user click on “learn more” after completing the quiz (results page)?
    // If the learn more is for an article:
    // category: article links action: suggested label: {{article title}}

    // If the learn more is for a product:
    // category: product links action: suggested label: {{product name}}

    // tracks all FAQ accordion open / close questions - faq-track class needed on or any parent element
    bpComponents.bpTrackers.faqSlidesTracker = new GTMTracker({
      id: 'faqSlidesTracker',
      eventCategory: 'faq',
      eventAction: '{{accordionOpenedClosed}}',
      eventTrigger: 'click',
      eventLabel: '{{childText}}',
      eventTargetSelector:
        '.faq-track .accordion-slide, .faq-track .accordion-slide .accordion-head, .faq-track .accordion-slide .accordion-head *',
      eventTargetClosestSelector: '.accordion-slide',
      eventTargetChildSelector: '.accordion-head',
      eventDelay: 1
    }).init();

    // tracks all links with data-article attribute contained in faq accordion, faq-track class on accordion needed or any parent element NOT DONE
    bpComponents.bpTrackers.faqArticleLinksTracker = new GTMTracker({
      id: 'faqArticleLinksTracker',
      eventCategory: 'external links',
      eventAction: '{{text}}',
      eventTrigger: 'click',
      eventLabel: '{{articleLinkName}}',
      eventTargetSelector: 'a[data-article], a[data-article] *',
      eventTargetClosestSelector: 'a[data-article]'
    }).init();

    // tracks FAQ filter selected category - faq-track class needed either on advancedParametrizedHtml or class-filter
    // bpComponents.bpTrackers.faqLinkstTracker = new GTMTracker({
    //   id: 'faqFilterTracker',
    //   eventCategory: 'faq links',
    //   eventAction: 'category selection',
    //   eventTrigger: 'click',
    //   eventLabel: '{{filterSelectedLabel}}',
    //   eventTargetSelector:
    //     '.faq-track .filter-item-js, .faq-track .filter-item-js *',
    //   eventTargetClosestSelector: '.filter-item-js',
    //   eventTargetParentSelector: '.class-filter'
    //   eventDelay: 1
    // }).init()

    // tracks brand logo clicks class to use: brand-click
    bpComponents.bpTrackers.brandLogoTracker = new GTMTracker({
      id: 'brandLogoTracker',
      eventCategory: 'navigation',
      eventAction: 'header',
      eventTrigger: 'click',
      eventLabel: '{{parentTitle}}',
      eventTargetSelector: '.icon-GSK-logo, .megamenu-bottom-center img',
      eventTargetClosestSelector: 'img,i',
      eventTargetParentSelector: '[title]'
    }).init();
  });

  window.GTMTracker = GTMTracker;
})(Cog.jQuery());
/*eslint-enable*/
