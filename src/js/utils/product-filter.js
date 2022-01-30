(function(global, $) {
  /**
   * To call it on document loaded
   */
  function init() {
    let navProductFilter = $(
      '.reference-product-filter-menu .filter-radio-as-list li'
    );
    let productFilter = $('.js-product-filter');

    if (navProductFilter.length || productFilter.length) {
      // (1):[Product Category filter] Hide/Show filterBox - Navbar | product-filter.html
      let findFilterCTA = $(
        '.reference-product-filter-menu .btn-primary-dark, .js-product-filter [class*="reference-product-filter-"] .btn-primary-dark'
      );
      let clearFilterCTA = $(
        '.reference-product-filter-menu .btn-secondary-dark, .js-product-filter [class*="reference-product-filter-"] .btn-secondary-dark'
      );
      let filterItems = $(
        '.js-product-filter .filter-item-js, [class*="reference-product-filter-"] .filter-item-js'
      );

      findFilterCTA.each((i, el) => {
        el.setAttribute('data-href', el.href);
        el.removeAttribute('href');
      });

      navProductFilter.length &&
        navProductFilter.on('click', categoryBoxFilter);
      filterItems.length && filterItems.on('click', filterItemSelect);
      findFilterCTA.length && findFilterCTA.on('click', findFilterCTAClick);
      clearFilterCTA.length && clearFilterCTA.on('click', clearFilterCTAClick);

      // (2):[Specific page filter] Hide/Show products
      if (productFilter.length) {
        // TO DO product filter
        triggerURLParamFilter();
      }
    }
  }

  /**
   * Help for category selection based on radio check
   * @param {EventListenerObject} e
   */
  function categoryBoxFilter(e) {
    e.preventDefault();
    let selectedCatgory = $(e?.currentTarget);
    let selectedCatgoryId = selectedCatgory[0].id;
    let filterParentWrapper = e?.currentTarget?.closest(
      '.paragraphSystem.content'
    );
    $(filterParentWrapper)
      ?.find('.filter-radio-as-list li')
      ?.removeClass('selected');
    $(filterParentWrapper)
      .find('[class*="filterbox-"]')
      .removeClass('active')
      .addClass('in-active');

    if (filterParentWrapper) {
      let filterBox = $(filterParentWrapper)?.find(
        '.filterbox-' + selectedCatgoryId
      );
      filterBox.removeClass('in-active').addClass('active');
      selectedCatgory.addClass('selected');
    }
  }

  /**
   * Help for items selection based on checkbox check and updated `selectedFilterItems[String]`
   * @param {EventListenerObject} e
   */
  function filterItemSelect(e) {
    e.preventDefault();
    let selectedFilterItem = $(e?.currentTarget);
    let filterItemsWrapper = selectedFilterItem?.closest(
      '[class*="filterbox-"], [class*="reference-product-filter-"]'
    );

    if (selectedFilterItem && !selectedFilterItem.hasClass('active-js')) {
      selectedFilterItem.addClass('active-js');
      selectedFilterItem.attr('aria-selected', true);
    } else {
      selectedFilterItem.removeClass('active-js');
      selectedFilterItem.attr('aria-selected', false);
    }
    let filterItems = filterItemsWrapper.find('.filter-item-js.active-js');

    if (filterItems.length === 0) {
      filterItemsWrapper.removeClass('enable-cta');
    } else {
      filterItemsWrapper.addClass('enable-cta');
    }
  }

  /**
   * Updated the `href` of CTA and redirect to selected given `href`
   * @param {EventListenerObject} e
   */
  function findFilterCTAClick(e) {
    e.preventDefault();
    let _filterCTA = e?.currentTarget;
    let _filterBox = _filterCTA?.closest(
      '[class*="filterbox-"], [class*="reference-product-filter-"]'
    );
    let _selectedFilterItems = $(_filterBox).find('.filter-item-js.active-js');
    let _link = _filterCTA.dataset.href;

    _selectedFilterItems = _selectedFilterItems
      .map((i, el) => {
        return el.classList.item(1);
      })
      .toArray();

    if ($('.js-product-filter').length > 0) {
      triggerProductFilter(_selectedFilterItems);
      return true;
    }

    if (_link.indexOf('?') > 0) {
      _link =
        _link +
        '&selectedFilters=' +
        encodeURIComponent(_selectedFilterItems.join());
    } else {
      _link =
        _link +
        '?selectedFilters=' +
        encodeURIComponent(_selectedFilterItems.join());
    }
    global.location.href = _link;
  }

  /**
   * Reset filter to default
   * @param {EventListenerObject} e
   */
  function clearFilterCTAClick(e) {
    let _filterBox = e.currentTarget?.closest(
      '[class*="filterbox-"], [class*="reference-product-filter-"]'
    );
    let _selectedFilterItems = $(_filterBox).find('.filter-item-js.active-js');
    _selectedFilterItems.removeClass('active-js');
    _selectedFilterItems.attr('aria-selected', false);
    triggerProductFilter([]);
  }

  /**
   * Creates Array of classList from `window.location.href` searchParams
   */
  function triggerURLParamFilter() {
    let url = new URL(window.location.href);
    let selectedFilters = url.searchParams.get('selectedFilters');
    if (selectedFilters !== null) {
      selectedFilters = decodeURIComponent(selectedFilters);
      selectedFilters = selectedFilters.split(',');
      if (Array.isArray(selectedFilters) && selectedFilters.length) {
        selectedFilters.forEach(el => $('.' + el).addClass('active-js'));
        triggerProductFilter(selectedFilters);
      }
    } else {
      triggerProductFilter([]);
    }
  }

  /**
   * Set the UI based on given `classList`
   * @param {Array} selectedFilters Array[String]
   */
  function triggerProductFilter(selectedFilters) {
    var products = $('.products-filter');
    if (selectedFilters.length) {
      products.each((i, el) => {
        if (el.matches('.' + selectedFilters.join('.'))) {
          el.style.display = 'block';
        } else {
          el.style.display = 'none';
        }
      });
    } else {
      $(products).css({ display: '' });
    }
  }

  function mutationHelper() {
    let targetNode = document.querySelector(
      '.reference-product-filter .class-filter.no-theme'
    );
    if (targetNode && !targetNode.classList.contains('initiated')) {
      const callback = function(mutationsList, observer) {
        if (mutationsList[0].type === 'attributes') {
          init();
          mo.disconnect();
        }
      };
      let mo = new MutationObserver(callback);
      mo.observe(targetNode, { attributes: true });
    } else {
      init();
    }
  }

  // Call `init` based on document state
  if (document.readyState !== 'loading') {
    mutationHelper();
  } else {
    document.addEventListener('DOMContentLoaded', mutationHelper);
  }
})(window, Cog.jQuery());
