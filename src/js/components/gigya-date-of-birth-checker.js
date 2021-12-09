(function($) {
  $(() => {
    const defaultAge = 18,
      init = form => {
        let t = $(form),
          classProp = t.prop('class'),
          dobMatch = classProp.match(/g\-dob\-(\d{1,2})/im),
          dobIndex = dobMatch === null ? false : dobMatch[1] - 1,
          dobInput =
            typeof dobIndex === 'number' && dobIndex > -1
              ? t.find('input[type="date"]').eq(dobIndex)
              : null,
          age = defaultAge;

        if (dobInput !== null && dobInput.length && dobInput.length > 0) {
          age = t.is('[class*="g-dob-y-"]')
            ? parseInt(classProp.match(/g\-dob\-y\-(\d{1,3})/im)[1])
            : defaultAge;
          age = isNaN(age) ? defaultAge : age;
          dobInput.attr({
            dob: true,
            'data-valid-age': age
          });
          t.find('input[type="submit"]').attr('disabled', true);
        }
      };

    $('[class*="g-dob-"]').each((ind, el) => {
      let t = $(el);

      if (t.find('> .gigya-raas.initialized').length === 0) {
        el.dobInit = setInterval(() => {
          if (t.find('> .gigya-raas.initialized').length > 0) {
            setTimeout(() => {
              init(el);
            }, 1000);
            clearInterval(el.dobInit);
          }
        });
      }
    });

    $('body').on('change', e => {
      try {
        let t = $(e.target),
          form,
          submiter,
          age,
          dobTime,
          diff,
          today,
          dob;
        if (t.is('input[dob]')) {
          form = t.closest('.gigya-raas.initialized');
          age = t.data('valid-age');
          submiter = form.find('input[type="submit"]');
          dobTime = new Date(t.val()).getTime();
          if (isNaN(dobTime)) return;
          today = new moment(new Date().getTime());

          dob = new moment(dobTime);
          diff = today.diff(dob, 'years').toObject().years;
          if (diff >= age) submiter.removeAttr('disabled');
          else submiter.attr('disabled', true);
        }
      } catch (error) {
        console.warn(error);
      }
    });
  });
})(Cog.jQuery());
