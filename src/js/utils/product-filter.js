(function(global, $) {
  /**
   * To call it on document loaded
   */
  function init() {
    let navProductFilter = $('.filter-radio-as-list li');
    let productFilter = $('.js-product-filter');

    if (navProductFilter.length || productFilter.length) {
      // (1):[Product Category filter] Hide/Show filterBox - Navbar | product-filter.html
      let findFilterCTA = $('.btn-primary-dark');
      let clearFilterCTA = $('.btn-secondary-dark');
      let filterItems = $('.filter-item-js');

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
      if (productFilter) {
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
    if (filterParentWrapper) {
      let filterBox = $(filterParentWrapper)?.find(
        '.filterbox-' + selectedCatgoryId
      );
      filterBox.addClass('active');
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
    if (selectedFilterItem && !selectedFilterItem.hasClass('active')) {
      selectedFilterItem.addClass('active');
    } else {
      selectedFilterItem.removeClass('active');
    }
  }

  /**
   * Updated the `href` of CTA and redirect to selected given `href`
   * @param {EventListenerObject} e
   */
  function findFilterCTAClick(e) {
    e.preventDefault();
    let _filterCTA = e?.currentTarget;
    let _filterBox = _filterCTA?.closest('[class*="filterbox-"]');
    let _selectedFilterItems = $(_filterBox).find('.filter-item-js.active');
    let _link = _filterCTA.dataset('href');

    _selectedFilterItems = _selectedFilterItems
      .map((i, el) => {
        return el.classList.item(1);
      })
      .toArray();

    if ($('.js-product-filter').length > 0) {
      triggerProductFilter(_selectedFilterItems);
      return true;
    }

    if (_filterCTA.href.indexOf('?') > 0) {
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
    $('.filter-item-js.active').removeClass('active');
  }

  /**
   * Creates Array of classList from `window.location.href` searchParams
   */
  function triggerURLParamFilter() {
    let url = new URL(window.location.href);
    let selectedFilters = url.searchParams.get('selectedFilters');
    selectedFilters = decodeURIComponent(selectedFilters);
    selectedFilters = selectedFilters.split(',');
    if (Array.isArray(selectedFilters) && selectedFilters.length) {
      triggerProductFilter(selectedFilters);
    }
  }

  /**
   * Set the UI based on given `classList`
   * @param {Array} selectedFilters Array[String]
   */
  function triggerProductFilter(selectedFilters) {
    var products = $('.products-filter');
    products.each((i, el) => {
      if (el.classList.contains(selectedFilters)) {
        el.style.display = 'block';
      } else {
        el.style.display = 'none';
      }
    });
  }

  // Call `init` based on document state
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
})(window, Cog.jQuery());
