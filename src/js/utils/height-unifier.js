($ => {
  const SCREEN_WIDTH_BREAKPOINT = 768;
  const ITEMS_PER_ROW = 3;
  const SELECTOR_ITEMS = '.block-unified-heights';

  $(() => {
    let $window = $(window);
    $window.resize(() => {
      resizeComponents(
        $window,
        SCREEN_WIDTH_BREAKPOINT,
        SELECTOR_ITEMS,
        ITEMS_PER_ROW
      );
    });
    resizeComponents(
      $window,
      SCREEN_WIDTH_BREAKPOINT,
      SELECTOR_ITEMS,
      ITEMS_PER_ROW
    );
  });

  function resizeComponents(
    $window,
    screenWidthBreakpoint,
    selectorItems,
    itemsPerRow
  ) {
    if (window.innerWidth >= screenWidthBreakpoint) {
      unifyHeights(selectorItems, itemsPerRow);
    } else {
      $(selectorItems).height('auto');
    }
  }

  function unifyHeights(selectorItems, itemsPerRow) {
    let $elems = $(selectorItems);
    $elems.height('');
    let elems = [].slice.call($elems);
    if (itemsPerRow) {
      elems.forEach((_elem, ind, arr) => {
        if ((ind + 1) % itemsPerRow === 0) {
          let groupElems = arr.slice(ind - itemsPerRow + 1, ind + 1);
          let height = groupElems.reduce((maxHeight, elem) => {
            let elemHeight = $(elem).height();
            let elemMinHeigt = parseInt($(elem).css('min-height'), 10);
            return Math.max(
              maxHeight,
              elemHeight > elemMinHeigt ? elemHeight : 0
            );
          }, 0);
          if (height === 0) {
            return;
          }
          groupElems.forEach(elem => {
            $(elem).height(height);
          });
        }
      });
    }
  }
})(Cog.jQuery());
