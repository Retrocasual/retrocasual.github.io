$( document ).ready(function() {

  // Настройка скролла сайта с помощью мышки
  var canScroll = true,
  scrollController = null;
  $(this).on('mousewheel', function(e){ // вызывается при событии прокрутки колесика мышки

    if (!($('.outer-nav').hasClass('is-vis'))) { // проверка, что внешнее меню НЕ открыто

      e.cancelable && e.preventDefault(); // предотвращает стандартное прокручивание страницы

      //Определяет направление прокрутки мыши и сохраняет его значение.
      var delta = (e.originalEvent.wheelDelta) ? -e.originalEvent.wheelDelta : e.originalEvent.detail * 20;

      if (delta > 50 && canScroll) { // прокрутка вниз и можно скроллить
        canScroll = false; //Задержка прокрутки на некоторое время, чтобы избежать частого вызова обработчика
        clearTimeout(scrollController); 
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800); // разблокировка возможности прокрутки через 800мс
        updateHelper(1); // вызывает функцию, передавая аргумент 1 для указания направления вниз
      }
      else if (delta < -50 && canScroll) { // прокрутка вверх и можно скроллить
        canScroll = false;
        clearTimeout(scrollController);
        scrollController = setTimeout(function(){
          canScroll = true;
        }, 800);
        updateHelper(-1); // вызывает функцию, передавая аргумент -1 для указания направления вверх
      }

    }

  });



  $('.side-nav li, .outer-nav li').click(function(){ //Вызывает событие при клике на элемент в боковом и внешнем меню 

    if (!($(this).hasClass('is-active'))) { // Проверка, что у элемента нет класса active, то есть раздел еще не выбран

      var $this = $(this),
          curActive = $this.parent().find('.is-active'), // находит текущий выбранный элемент меню (с классом active)
          curPos = $this.parent().children().index(curActive), // определяет индекс текущего элемента 
          nextPos = $this.parent().children().index($this), // определяет индекс выбранного элемента
          lastItem = $(this).parent().children().length - 1; // определяет индекс последнего элемента

      updateNavs(nextPos); 
      updateContent(curPos, nextPos, lastItem);

    }

  });


  $('.cta').click(function(){ // Вызывает событие при клике на кнопку "Нанять меня"

    var curActive = $('.side-nav').find('.is-active'),  // находит текущий выбранный элемент меню
        curPos = $('.side-nav').children().index(curActive), // определяет индекс текущего элемента
        lastItem = $('.side-nav').children().length - 1, // определяет индекс последнего элемента
        nextPos = lastItem; // устанавливает следующую позиции - последний элемент меню / секции

    updateNavs(lastItem); // обновление меню
    updateContent(curPos, nextPos, lastItem); // переход на последнюю секцию

  });






  // Добавление поддержки свайпов на сенсорных устройствах с использованием библиотеки Hammer.js
  var targetElement = document.getElementById('viewport'),
  mc = new Hammer(targetElement);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL }); // направление только вертикальное
  mc.on('swipeup swipedown', function(e) { // когда происходит свайп вверх или вниз, вызывается функция updateHelper

    updateHelper(e);

  });

  $(document).keyup(function(e){ // При отпускании клавиши

    if (!($('.outer-nav').hasClass('is-vis'))) { // Если меню НЕ открыто
      e.preventDefault();
      updateHelper(e); // вызывается функция 
    }

  }); 
   
  // Определение направления скролла, свайпа и стрелки на клавиатуре
  function updateHelper(param) {

    var curActive = $('.side-nav').find('.is-active'), 
        curPos = $('.side-nav').children().index(curActive), // находит индес текущего элемента
        lastItem = $('.side-nav').children().length - 1, // индекс последнего элемента
        nextPos = 0;

    // Если событие свайп вверх или стрелка вниз или скролл вниз
    if (param.type === "swipeup" || param.keyCode === 40 || param > 0) { 
      if (curPos !== lastItem) {
        nextPos = curPos + 1; // nextPos - следующая секция по очереди
        updateNavs(nextPos); // обновление меню
        updateContent(curPos, nextPos, lastItem); // переход на выбранную секцию nextPos
      }
      else { // дошли до конца слайдера, переход на начало, следующая секция - первая
        updateNavs(nextPos);  
        updateContent(curPos, nextPos, lastItem);  
      }
    }
    // Если событие свайп вниз или стрелка вверх или скролл вверх
    else if (param.type === "swipedown" || param.keyCode === 38 || param < 0){
      if (curPos !== 0){
        nextPos = curPos - 1; // nextPos - предыдущая секция по очереди
        updateNavs(nextPos); // обновление меню
        updateContent(curPos, nextPos, lastItem);  // переход на выбранную секцию nextPos
      }
      else {
        nextPos = lastItem; // дошли до начала, переход в конец, следующая секция - последняя
        updateNavs(nextPos);
        updateContent(curPos, nextPos, lastItem); 
      }
    }

  }

  // синхронизация меню и выбранность элементов
  function updateNavs(nextPos) {

    $('.side-nav, .outer-nav').children().removeClass('is-active'); // сбрасывает у всех элементов меню "выбранность"
    $('.side-nav').children().eq(nextPos).addClass('is-active'); // добавляет элементу класс active, с индексом nextPos
    $('.outer-nav').children().eq(nextPos).addClass('is-active'); // добавляет элементу класс active, с индексом nextPos

  }

  // Переход по секциям - большой слайдер с 4 секциями-слайдами
  function updateContent(curPos, nextPos, lastItem) {

    $('.main-content').children().removeClass('section--is-active'); // сбрасывает у всех секций "выбранность"
    $('.main-content').children().eq(nextPos).addClass('section--is-active'); // добавляет класс active секции с индексом nextPos
    $('.main-content .section').children().removeClass('section--next section--prev'); // сбрасывает состояние пред и след секций

    // удаляет класс пред. и слд. секции  
    if (curPos === lastItem && nextPos === 0 || curPos === 0 && nextPos === lastItem) { 
      $('.main-content .section').children().removeClass('section--next section--prev');
    }
    // текущая секция становится следующей, если текущий индекс меньше чем следующий выбранной
    else if (curPos < nextPos) {
      $('.main-content').children().eq(curPos).children().addClass('section--next'); 
    }
     // Иначе она становится предыдущей
    else {
      $('.main-content').children().eq(curPos).children().addClass('section--prev');
    }

    if (nextPos !== 0 && nextPos !== lastItem) { // Кнопка "Нанять меня" появляется, если это НЕ первая И НЕ последняя секция
      $('.header--cta').addClass('is-active');
    }
    else {
      $('.header--cta').removeClass('is-active'); // В остальных случаях кнопка пропадает
    }

  }

  function outerNav() { // Изменение перспективы и масштаба при открытии внешнего меню

    $('.header--nav-toggle').click(function(){ // При клике на бургер меню

      $('.perspective').addClass('perspective--modalview'); // меняется масштаб и перспектива (добавляется класс modalview)
      setTimeout(function(){
        $('.perspective').addClass('effect-rotate-left--animate'); // через 25млс добавляется эффект поворта влево (добав. класс)
      }, 25);
      $('.outer-nav, .outer-nav li, .outer-nav--return').addClass('is-vis'); // появление  внешнего меню

    });

    $('.outer-nav--return, .outer-nav li').click(function(){ // при клике на сайт с модальным видом или на элемент меню

      $('.perspective').removeClass('effect-rotate-left--animate'); // удаляется класс с эффектом поворота
      setTimeout(function(){
        $('.perspective').removeClass('perspective--modalview'); // через задержку удаляется эффект модального вида
      }, 400);
      $('.outer-nav, .outer-nav li, .outer-nav--return').removeClass('is-vis'); // пропадает внешнее меню

    });

  }

  // Слайдер
  function workSlider() {

    $('.slider--prev, .slider--next').click(function() { // Пр клике на кнопки слайдера
      
      // определение индексов текущих слайдов (левого, по центру, правого и текущего)
      var $this = $(this), 
          curLeft = $('.slider').find('.slider--item-left'),
          curLeftPos = $('.slider').children().index(curLeft),
          curCenter = $('.slider').find('.slider--item-center'),
          curCenterPos = $('.slider').children().index(curCenter),
          curRight = $('.slider').find('.slider--item-right'),
          curRightPos = $('.slider').children().index(curRight),
          totalWorks = $('.slider').children().length,
          $left = $('.slider--item-left'),
          $center = $('.slider--item-center'),
          $right = $('.slider--item-right'),
          $item = $('.slider--item');

      $('.slider').animate({ opacity : 0 }, 400); // Скрытие слайдера через прозрачности

      setTimeout(function(){ // обновление слайдов в слайдере с задержкой 400мс

      if ($this.hasClass('slider--next')) {
        if (curLeftPos < totalWorks - 1 && curCenterPos < totalWorks - 1 && curRightPos < totalWorks - 1) {
          $left.removeClass('slider--item-left').next().addClass('slider--item-left');
          $center.removeClass('slider--item-center').next().addClass('slider--item-center');
          $right.removeClass('slider--item-right').next().addClass('slider--item-right');
        }
        else {
          if (curLeftPos === totalWorks - 1) {
            $item.removeClass('slider--item-left').first().addClass('slider--item-left');
            $center.removeClass('slider--item-center').next().addClass('slider--item-center');
            $right.removeClass('slider--item-right').next().addClass('slider--item-right');
          }
          else if (curCenterPos === totalWorks - 1) {
            $left.removeClass('slider--item-left').next().addClass('slider--item-left');
            $item.removeClass('slider--item-center').first().addClass('slider--item-center');
            $right.removeClass('slider--item-right').next().addClass('slider--item-right');
          }
          else {
            $left.removeClass('slider--item-left').next().addClass('slider--item-left');
            $center.removeClass('slider--item-center').next().addClass('slider--item-center');
            $item.removeClass('slider--item-right').first().addClass('slider--item-right');
          }
        }
      }
      else {
        if (curLeftPos !== 0 && curCenterPos !== 0 && curRightPos !== 0) {
          $left.removeClass('slider--item-left').prev().addClass('slider--item-left');
          $center.removeClass('slider--item-center').prev().addClass('slider--item-center');
          $right.removeClass('slider--item-right').prev().addClass('slider--item-right');
        }
        else {
          if (curLeftPos === 0) {
            $item.removeClass('slider--item-left').last().addClass('slider--item-left');
            $center.removeClass('slider--item-center').prev().addClass('slider--item-center');
            $right.removeClass('slider--item-right').prev().addClass('slider--item-right');
          }
          else if (curCenterPos === 0) {
            $left.removeClass('slider--item-left').prev().addClass('slider--item-left');
            $item.removeClass('slider--item-center').last().addClass('slider--item-center');
            $right.removeClass('slider--item-right').prev().addClass('slider--item-right');
          }
          else {
            $left.removeClass('slider--item-left').prev().addClass('slider--item-left');
            $center.removeClass('slider--item-center').prev().addClass('slider--item-center');
            $item.removeClass('slider--item-right').last().addClass('slider--item-right');
          }
        }
      }

    }, 400);

    $('.slider').animate({ opacity : 1 }, 400); // Возращение слайдера, изменение прозрачности на 1

    });

  }

  outerNav(); // Вызывание функции 
  workSlider(); // Вызывание функции 
});

