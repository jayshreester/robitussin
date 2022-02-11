(function(global, $) {
  class ProductFilter {
    static SELECTOR = '[class*="filterbox-"]';
    static FILTER_ITEM_SELECTOR = '.filter-item-js';

    constructor(global, $, targetNode) {
      this.global = global;
      this.$targetNode = $(targetNode).closest('.paragraphSystem.content');
      this.$navProductFilter = this.$targetNode
        ?.closest('.reference-product-filter-menu')
        .find('.filter-radio-as-list li');
      this.$productFilter = $('.js-product-filter');
      this.$findFilterCTA = this.$targetNode.find('.findmyrobitussinbtn');
      this.$clearFilterCTA = this.$targetNode.find('.filterbutton');
      this.$filterItems = this.$targetNode.find(
        ProductFilter.FILTER_ITEM_SELECTOR
      );
      this.selectedCatgoryId = null;

      this.init();
    }

    /**
     * Init() method to register all events
     */
    init() {
      if (this.$navProductFilter.length || this.$productFilter.length) {
        // (1):[Product Category filter] Hide/Show filterBox - Navbar | product-filter.html
        this.$findFilterCTA.each((i, el) => {
          el.setAttribute('data-href', el.href);
          el.removeAttribute('href');
        });

        this.$navProductFilter.length &&
          this.$navProductFilter.on('click', this.categoryBoxFilter.bind(this));
        this.$filterItems.length &&
          this.$filterItems.on('click', this.filterItemSelect.bind(this));
        this.$findFilterCTA.length &&
          this.$findFilterCTA.on('click', this.findFilterCTAClick.bind(this));
        this.$clearFilterCTA.length &&
          this.$clearFilterCTA.on('click', this.clearFilterCTAClick.bind(this));

        // (2):[Specific page filter] Hide/Show products
        if (this.$productFilter.length && this.$navProductFilter.length === 0) {
          // TO DO product filter
          this.selectedCatgoryId = $('.filterbox-adults').length
            ? 'adults'
            : $('.filterbox-children').length
            ? 'children'
            : $('.filterbox-naturals').length
            ? 'naturals'
            : null;
          $('.cf-' + this.selectedCatgoryId)?.addClass('enable');
          this.triggerURLParamFilter();
        }
      }
    }

    /**
     * Help for category selection based on radio check
     * @param {EventListenerObject} e
     */
    categoryBoxFilter(e) {
      e.preventDefault();
      let $selectedCatgory = $(e?.currentTarget);
      this.selectedCatgoryId = $selectedCatgory[0].id;
      this.$targetNode
        ?.find('.filter-radio-as-list li')
        ?.removeClass('selected');
      this.$targetNode?.closest(ProductFilter.SELECTOR)?.addClass('active');

      if (this.$targetNode) {
        this.$filterItems?.removeClass('enable');
        this.$filterItems?.removeClass('active-js'); // J
        this.$targetNode
          ?.find('.cf-' + this.selectedCatgoryId)
          ?.addClass('enable');
      }
    }

    /**
     * Help for items selection based on checkbox check and updated `selectedFilterItems[String]`
     * @param {EventListenerObject} e
     */
    filterItemSelect(e) {
      e.preventDefault();
      let $selectedFilterItem = $(e?.currentTarget);
      if (
        $selectedFilterItem
          .closest(ProductFilter.SELECTOR)
          .hasClass('active') &&
        $selectedFilterItem.hasClass('enable')
      ) {
        let $filterItemsWrapper = $selectedFilterItem?.closest(
          ProductFilter.SELECTOR
        );

        if ($selectedFilterItem && !$selectedFilterItem.hasClass('active-js')) {
          $selectedFilterItem.addClass('active-js');
          $selectedFilterItem.attr('aria-selected', true);
        } else {
          $selectedFilterItem.removeClass('active-js');
          $selectedFilterItem.attr('aria-selected', false);
        }
        let filterItems = $filterItemsWrapper.find(
          ProductFilter.FILTER_ITEM_SELECTOR + '.active-js'
        );

        if (filterItems.length === 0) {
          $filterItemsWrapper.removeClass('enable-cta');
        } else {
          $filterItemsWrapper.addClass('enable-cta');
        }
      }
    }

    /**
     * Updated the `href` of CTA and redirect to selected given `href`
     * @param {EventListenerObject} e
     */
    findFilterCTAClick(e) {
      e.preventDefault();
      let _filterCTA = e?.currentTarget;
      let _filterBox = _filterCTA?.closest(ProductFilter.SELECTOR);
      let _$selectedFilterItems = $(_filterBox).find(
        ProductFilter.FILTER_ITEM_SELECTOR + '.active-js'
      );
      let _link = null;

      if (this.selectedCatgoryId) {
        _link = _filterCTA.dataset[this.selectedCatgoryId + 'Href'];
      } else {
        _link = _filterCTA.dataset.href;
      }

      if (_filterBox.classList.contains('enable-cta')) {
        _$selectedFilterItems = _$selectedFilterItems
          .map((i, el) => {
            return el.classList.item(1);
          })
          .toArray();

        if (
          this.$productFilter.length > 0 &&
          this.$navProductFilter.length === 0
        ) {
          this.triggerProductFilter(_$selectedFilterItems);
          return true;
        }

        if (_link.indexOf('?') > 0) {
          _link =
            _link +
            '&selectedFilters=' +
            encodeURIComponent(_$selectedFilterItems.join());
        } else {
          _link =
            _link +
            '?selectedFilters=' +
            encodeURIComponent(_$selectedFilterItems.join());
        }
        global.location.href = _link;
      }
    }

    /**
     * Reset filter to default
     * @param {EventListenerObject} e
     */
    clearFilterCTAClick(e) {
      let _filterBox = e.currentTarget?.closest(ProductFilter.SELECTOR);
      let _$selectedFilterItems = $(_filterBox).find(
        ProductFilter.FILTER_ITEM_SELECTOR + '.active-js'
      );
      _$selectedFilterItems.removeClass('active-js');
      _$selectedFilterItems.attr('aria-selected', false);
      this.triggerProductFilter([]);
    }

    /**
     * Creates Array of classList from `window.location.href` searchParams
     */
    triggerURLParamFilter() {
      let that = this;
      let url = new URL(window.location.href);
      let selectedFilters = url.searchParams.get('selectedFilters');
      if (selectedFilters !== null) {
        selectedFilters = decodeURIComponent(selectedFilters);
        selectedFilters = selectedFilters.split(',');
        if (Array.isArray(selectedFilters) && selectedFilters.length) {
          selectedFilters.forEach(el =>
            that.$targetNode.find('.' + el).addClass('active-js')
          );
          that.$targetNode
            .find(ProductFilter.SELECTOR + '.active')
            .addClass('enable-cta');
          that.triggerProductFilter(selectedFilters);
        }
      } else {
        that.triggerProductFilter([]);
      }
    }

    /**
     * Set the UI based on given `classList`
     * @param {Array} selectedFilters Array[String]
     */
    triggerProductFilter(selectedFilters) {
      var products = this.$productFilter.find('.products-filter');
      var that = this;
      if (selectedFilters.length) {
        $('.product-cat-title').addClass('hide');

        products.each((i, el) => {
          if (el.matches('.' + selectedFilters.join('.'))) {
            el.classList.remove('hide');
          } else {
            el.classList.add('hide');
          }
        });

        if ($('.products-filter:not(.hide)').length === 0) {
          $('.no-result-title').removeClass('hide');
          $('.result-product-title').addClass('hide');
        } else {
          let SelectedFiltersText = selectedFilters.map(selectedFilter => {
            return that.$targetNode.find('.' + selectedFilter)[0].innerText;
          });
          $('.no-result-title').addClass('hide');
          $('.result-product-title').removeClass('hide');
          $('#selectedfilterstext').text(SelectedFiltersText.join(', '));
        }
      } else {
        $('.product-cat-title').removeClass('hide');
        $('.no-result-title').addClass('hide');
        $('.result-product-title').addClass('hide');
        $(products).removeClass('hide');
      }
    }
  }

  function mutationHelper() {
    let targetNodes = document.querySelectorAll(
      '[class*=filterbox-] .class-filter.no-theme'
    );
    targetNodes.forEach(targetNode => {
      if (targetNode && !targetNode.classList.contains('initiated')) {
        const callback = function(mutationsList, observer) {
          if (mutationsList[0].type === 'attributes') {
            new ProductFilter(global, $, targetNode);
            mo.disconnect();
          }
        };
        let mo = new MutationObserver(callback);
        mo.observe(targetNode, { attributes: true });
      } else {
        new ProductFilter(global, $, targetNode);
      }
    });
  }

  // Call `init` based on document state
  if (document.readyState !== 'loading') {
    mutationHelper();
  } else {
    document.addEventListener('DOMContentLoaded', mutationHelper);
  }
})(window, Cog.jQuery());
