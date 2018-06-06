/*!
 *
 * Evgeniy Ivanov - 2018
 * busforward@gmail.com
 * Skype: ivanov_ea
 *
 */

var TempApp = {
    lgWidth: 1200,
    mdWidth: 992,
    smWidth: 768,
    resized: false,
    iOS: function() { return navigator.userAgent.match(/iPhone|iPad|iPod/i); },
    touchDevice: function() { return navigator.userAgent.match(/iPhone|iPad|iPod|Android|BlackBerry|Opera Mini|IEMobile/i); }
};

function isLgWidth() { return $(window).width() >= TempApp.lgWidth; } // >= 1200
function isMdWidth() { return $(window).width() >= TempApp.mdWidth && $(window).width() < TempApp.lgWidth; } //  >= 992 && < 1200
function isSmWidth() { return $(window).width() >= TempApp.smWidth && $(window).width() < TempApp.mdWidth; } // >= 768 && < 992
function isXsWidth() { return $(window).width() < TempApp.smWidth; } // < 768
function isIOS() { return TempApp.iOS(); } // for iPhone iPad iPod
function isTouch() { return TempApp.touchDevice(); } // for touch device

$(document).ready(function() {

    // Хак для клика по ссылке на iOS
    if (isIOS()) {
        $(function(){$(document).on('touchend', 'a', $.noop)});
    }

	if ('flex' in document.documentElement.style) {
		// Хак для UCBrowser
		if (navigator.userAgent.search(/UCBrowser/) > -1) {
			document.documentElement.setAttribute('data-browser', 'not-flex');
		} else {		
		    // Flexbox-совместимый браузер.
			document.documentElement.setAttribute('data-browser', 'flexible');
		}
	} else {
	    // Браузер без поддержки Flexbox, в том числе IE 9/10.
		document.documentElement.setAttribute('data-browser', 'not-flex');
	}

	// First screen full height
	function setHeiHeight() {
	    $('.full__height').css({
	        minHeight: $(window).height() + 'px'
	    });
	}
	setHeiHeight(); // устанавливаем высоту окна при первой загрузке страницы
	$(window).resize( setHeiHeight ); // обновляем при изменении размеров окна


	// Reset link whte attribute href="#"
	$('[href*="#"]').click(function(event) {
		event.preventDefault();
	});

	// Scroll to ID // Плавный скролл к элементу при нажатии на ссылку. В ссылке указываем ID элемента
	$('[data-scroll-to]').click( function() {
		var scroll_el = $(this).attr('data-scroll-to'); 
		if ($(scroll_el).length != 0) {
		$('html, body').animate({ scrollTop: $(scroll_el).offset().top }, 500);
		}
		return false;
	});

	// Stiky menu // Липкое меню. При прокрутке к элементу #header добавляется класс .stiky который и стилизуем
    // $(document).ready(function(){
    //     var HeaderTop = $('#header').offset().top;
        
    //     $(window).scroll(function(){
    //             if( $(window).scrollTop() > HeaderTop ) {
    //                     $('#header').addClass('stiky');
    //             } else {
    //                     $('#header').removeClass('stiky');
    //             }
    //     });
    // });
   	// setGridMatch($('[data-grid-match] .grid__item'));
    $('.exampleSlider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        // fade: true,
        adaptiveHeight: true,
        draggable: false,
        asNavFor: '.exampleThumbs',
        responsive: [{
            breakpoint: 768,
            settings: {
                draggable: true
            }
        }]
    });
    $('.exampleThumbs').slick({
        slidesToShow: 9,
        slidesToScroll: 1,
        asNavFor: '.exampleSlider',
        arrows: false,
        dots: false,
        centerMode: false,
        // infinite: true,
        focusOnSelect: true,
        responsive: [{
            breakpoint: 768,
            settings: {
                slidesToShow: 3,
                // centerMode: true,
                // vertical: false,
                // variableWidth: true
            }
        }]
    });

    $('.reviewSlider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        adaptiveHeight: true,
        draggable: true
    });

    $('.chart__wrap').viewportChecker({
    	offset: $('.chart__wrap').height() * 0.8,
    	callbackFunction: function(elem, action){
    		chartAnim();
    	},
    });

    $('.faqs__toggle').on('click', function() {
    	var item = $(this).closest('.faqs__item');

    	if (item.hasClass('open')) {
    		item.removeClass('open');
    	} else {
    		$('.faqs__item').removeClass('open');
	    	item.addClass('open');
    	}
    });

    chartAnim();
   	gridMatch();
   	calaculate();

    $('.tooltip').tooltipster({
        contentAsHTML: true,
        trigger: 'custom',
        maxWidth: 300,
        interactive: true,
        triggerOpen: {
            click: true
        },
        triggerClose: {
            scroll: true,
            mouseleave: true
            // click: true
        }
    });

    $('.bounceDown').addClass('hidden').viewportChecker({
        offset: 150,
        callbackFunction: function(elem, action){
            elem.addClass('visible animated fadeInDown');
        }
    })
    $('.bounceUp').addClass('hidden').viewportChecker({
        offset: 150,
        callbackFunction: function(elem, action){
            elem.addClass('visible animated fadeInUp');
        }
    })
    $('.bounceLeft').addClass('hidden').viewportChecker({
        offset: 150,
        callbackFunction: function(elem, action){
            elem.addClass('visible animated bounceInRight');
        }
    })

    $('[name=tel]').inputmask("+9(999)999 99 99",{ showMaskOnHover: false });

    formSubmit();
});

$(window).resize(function(event) {
    var windowWidth = $(window).width();
    // Запрещаем выполнение скриптов при смене только высоты вьюпорта (фикс для скролла в IOS и Android >=v.5)
    if (TempApp.resized == windowWidth) { return; }
    TempApp.resized = windowWidth;

	checkOnResize()
});

function checkOnResize() {
   	// setGridMatch($('[data-grid-match] .grid__item'));
   	gridMatch();
    chartAnim();
}

function gridMatch() {
   	$('[data-grid-match] .grid__item').matchHeight({
   		byRow: true,
   	});
}

function chartAnim() {
    $('.chart__wrap').viewportChecker({
        offset: $('.chart__wrap').height() * 0.8,
        callbackFunction: function(elem, action){
            $('.chart__column').each(function(index, el) {
            	var chartHeight = $('.chart__wrap').height() - $('.chart__rowX').height() - 52;
            	var colHeight = $(this).data('colHeight') / 20 * (chartHeight / 100);

            	$(this).height(colHeight);
            });
            setTimeout(function() {
                $('.chart__tooltip').addClass('show');
            }, 500);
            setTimeout(function() {
                $('.chart__tooltipImg').addClass('show');
            }, 600);
        },
    });
}

function calaculate() {
    // Капитализация IPO
    var capitalisationIpoDollar = 1000000000;
    var capitalisationIpoEuro = capitalisationIpoDollar*exchangeDollar/exchangeEuro;
    var capitalisationIpoRub = capitalisationIpoDollar*exchangeDollar;

    var capitalisation110Dollar = 110000000;
    var capitalisation110Euro = capitalisation110Dollar*exchangeDollar/exchangeEuro;
    var capitalisation110Rub = capitalisation110Dollar*exchangeDollar;

    var capitalisation200Dollar = 200000000;
    var capitalisation200Euro = capitalisation200Dollar*exchangeDollar/exchangeEuro;
    var capitalisation200Rub = capitalisation200Dollar*exchangeDollar;

    var capitalisation300Dollar = 300000000;
    var capitalisation300Euro = capitalisation300Dollar*exchangeDollar/exchangeEuro;
    var capitalisation300Rub = capitalisation300Dollar*exchangeDollar;

    // console.log(ipoRub)
    // console.log(ipoDollar)
    // console.log(ipoEuro)

	// Текущая валюта
	var currency = $('.calculate__currencyItem.active').data('currency');
    var currencyTemplate = '<span class="txt__danger"> '+currency+'</span>';
    var percentTemplate = '<span class="txt__danger">%</span>';
    var currencyValue;
    // Стоимость 
    var sliderPrice = $( ".calculate__slider" );
    var inputCurrent = $('.calculate__current');
    var entryThreshold = $('#entry_threshold td');
    var investedAmount = $('#invested_amount td');

    var sliderValue;
    var sliderMin;
    var sliderMax;
    var sliderStep;

    $('.calculate__currencyItem').on('click', function(event) {
        event.preventDefault();
        $('.calculate__currencyItem').removeClass('active');
        $(this).addClass('active');
        currency = $(this).data('currency');
        currencyTemplate = '<span class="txt__danger"> '+currency+'</span>';
        // setCurrencyInput();
        if (currency == "P") {
            sliderInit(10000000, 60000, 60000000, 1000);
        }
        if (currency == "$") {
            sliderInit(100000, 1000, 1000000, 100);
        }
        if (currency == "€") {
            sliderInit(100000, 1000, 1000000, 100);
        }
        setCurrency();
	});

    sliderInit(10000000, 60000, 60000000, 1000);

    inputCurrent.priceFormat();

    inputCurrent.on('keyup', function() {
        var keyupVal = $(this).val().replace(/\s+/g,'');
        var keyupValClean = keyupVal.replace(/[.,\/#!₽$%\^&\*;:{}=\-_`~()]/g,"");
        // console.log(keyupValClean);
        if (sliderValue >= sliderMin || sliderValue <= sliderMax) {
            sliderPrice.slider( 'value', keyupValClean);
        }
        setInvestedAmount(currencyValue);
        setCurrency();
    });

    setCurrency();

    // console.log(currencyValue);

    function sliderInit(valCurrent, minCurrent, maxCurrent, stepCurrent) {
        sliderValue = valCurrent;
        sliderMin = minCurrent;
        sliderMax = maxCurrent;
        sliderStep = stepCurrent;

    	sliderPrice.slider({
    		range: "min",
    		value: valCurrent,
    		min: minCurrent,
    		max: maxCurrent,
            step: stepCurrent,
    		slide: function( event, ui ) {
    			inputCurrent.val( thousandSeparator(ui.value));
                currencyValue = thousandSeparator(ui.value);
                setInvestedAmount(currencyValue);
                // setCurrency();
    		}
    	});
    }

    function setCurrency() {
        console.log(sliderValue)
        console.log(sliderMin)
        console.log(sliderMax)
        console.log(sliderStep);

        inputCurrent.val( thousandSeparator(sliderPrice.slider( 'value' )));
        currencyValue =  thousandSeparator(sliderPrice.slider( 'value' ));

        setCurrencyInput();
        // sliderInit();
    }

    // Выводим значения в таблицу
    function setCurrencyInput() {
        if (currency == "P") {
            inputCurrent.removeClass('dollar euro'); 
            inputCurrent.addClass('ru');
            setEntryThreshold('600 000', '600 000', '60 000');

            $('.calculate__scale_notRu').removeClass('active');
            $('.calculate__scale_ru').addClass('active');

            currencyValueClean = Number(currencyValue.replace(/\s+/g,''));
            var firstPercent = (currencyValueClean/capitalisation110Rub*100).toFixed(4);
            var secondPercent = (currencyValueClean/capitalisation200Rub*100).toFixed(4);

            setShareInCompany(firstPercent, secondPercent);
            setMonthlyIncome(0.05, 0.17, currencyValueClean);
            setCostForecast(firstPercent*capitalisationIpoRub, secondPercent*capitalisationIpoRub, currencyValueClean+(profitMonthlySecond*36));
            setProfitableness(firstPercent, secondPercent, currencyValueClean, capitalisationIpoRub);
        }
        if (currency == "$") {
            inputCurrent.removeClass('ru euro'); 
            inputCurrent.addClass('dollar');
            setEntryThreshold('10 000', '10 000', '1 000');

            $('.calculate__scale_notRu').addClass('active');
            $('.calculate__scale_ru').removeClass('active');

            currencyValueClean = Number(currencyValue.replace(/\s+/g,''));
            var firstPercent = (currencyValueClean/capitalisation110Dollar*100).toFixed(4);
            var secondPercent = (currencyValueClean/capitalisation200Dollar*100).toFixed(4);

            setShareInCompany(firstPercent, secondPercent);
            setCostForecast(firstPercent*capitalisationIpoDollar, secondPercent*capitalisationIpoDollar, currencyValueClean+(profitMonthlySecond*36))
            setMonthlyIncome(0.05, 0.07, currencyValueClean);
            setProfitableness(firstPercent, secondPercent, currencyValueClean, capitalisationIpoDollar);
        }
        if (currency == "€") {
            inputCurrent.removeClass('dollar ru'); 
            inputCurrent.addClass('euro'); 
            setEntryThreshold('10 000', '10 000', '1 000');

            $('.calculate__scale_notRu').addClass('active');
            $('.calculate__scale_ru').removeClass('active');

            currencyValueClean = Number(currencyValue.replace(/\s+/g,''));
            var firstPercent = (currencyValueClean/capitalisation110Euro*100).toFixed(4);
            var secondPercent = (currencyValueClean/capitalisation200Euro*100).toFixed(4);

            setShareInCompany(firstPercent, secondPercent);
            setCostForecast(firstPercent*capitalisationIpoEuro, secondPercent*capitalisationIpoEuro, currencyValueClean+(profitMonthlySecond*36))
            setMonthlyIncome(0.05, 0.07, currencyValueClean);
            setProfitableness(firstPercent, secondPercent, currencyValueClean, capitalisationIpoEuro);
        }
        setInvestedAmount(currencyValue);
    }

    // Порог входа
    function setEntryThreshold(first, second, last) {
        entryThreshold.each(function() {
        // console.log($(this).data('edition'))           
            if ($(this).data('edition') == '1') {
                $(this).html(first+currencyTemplate);
            }
            if ($(this).data('edition') == '2') {
                $(this).html(second+currencyTemplate);
            }
            if ($(this).data('edition') == '3') {
                $(this).html(last+currencyTemplate);
            }
        });
    }
    // Задаем инвестируемую сумму
    function setInvestedAmount(summ) {
        investedAmount.each(function() {
        // console.log($(this).data('edition'))           
            if ($(this).data('edition')) {
                $(this).html(summ+currencyTemplate);
            }
        });
    }
    // Доля в компании
    function setShareInCompany(first, second) {
        $('#share_in_company [data-edition]').each(function() {
            if ($(this).data('edition') == '1') {
                $(this).html(first + percentTemplate);
            }
            if ($(this).data('edition') == '2') {
                $(this).html(second + percentTemplate);
            }
        });
    }
    // Прогноз стоимости актива через 3 года
    function setCostForecast(first, second, last) {
        $('#cost_forecast [data-edition]').each(function() {
            if ($(this).data('edition') == '1') {
                $(this).html(thousandSeparator((first/100).toFixed()) + currencyTemplate);
            }
            if ($(this).data('edition') == '2') {
                $(this).html(thousandSeparator((second/100).toFixed()) + currencyTemplate);
            }
            if ($(this).data('edition') == '3') {
                $(this).html(thousandSeparator(last) + currencyTemplate);
            }
        });
    }
    // Ежемесячный доход
    function setMonthlyIncome(percentFirst, percentSecond, current) {
        $('#monthly_income [data-edition]').each(function() {
            if ($(this).data('edition') == '1') {
                $(this).html(thousandSeparator((current*percentFirst/12).toFixed()) + currencyTemplate);
                profitMonthlyFirst = Number(current*percentFirst/12).toFixed();
                return profitMonthlyFirst;
            }
            if ($(this).data('edition') == '2') {
                $(this).html(thousandSeparator((current*percentSecond/12).toFixed()) + currencyTemplate);
                profitMonthlySecond = Number(current*percentSecond/12).toFixed();
                return profitMonthlySecond;
            }
        });
    }
    // Доходность % годовых
    // setProfitableness(firstPercent, secondPercent, currencyValueClean, capitalisationIpoRub);
    function setProfitableness(percentFirst, percentSecond, current, capitalisation) {
        $('#profitableness td').each(function() {
            if ($(this).data('edition') == '1') {
                $(this).html('<br>'
                    + ((percentFirst*capitalisation)/current/3).toFixed() + percentTemplate + '<br>'
                    + ((percentFirst*capitalisation)/current/4).toFixed() + percentTemplate + '<br>'
                    + ((percentFirst*capitalisation)/current/5).toFixed() + percentTemplate
                );
            }
            if ($(this).data('edition') == '2') {
                $(this).html('<br>'
                    + (((percentSecond*capitalisation)+Number(profitMonthlyFirst)*36)/current/3+6).toFixed() + percentTemplate + '<br>'
                    + (((percentSecond*capitalisation)+Number(profitMonthlyFirst)*48)/current/4+6).toFixed() + percentTemplate + '<br>'
                    + (((percentSecond*capitalisation)+Number(profitMonthlyFirst)*60)/current/5+6).toFixed() + percentTemplate
                );
            }
        });
    }
}



function thousandSeparator(str) {
    var parts = (str + '').split('.'),
        main = parts[0],
        len = main.length,
        output = '',
        i = len - 1;
    
    while(i >= 0) {
        output = main.charAt(i) + output;
        if ((len - i) % 3 === 0 && i > 0) {
            output = ' ' + output;
        }
        --i;
    }

    if (parts.length > 1) {
        output += '.' + parts[1];
    }
    return output;
};


// Хак для яндекс карт втавленных через iframe
document.addEventListener('click', function(e) {
    var map = document.querySelector('#map-wrap iframe')
    if(e.target.id === 'map-wrap') {
        map.style.pointerEvents = 'all'
    } else {
        map.style.pointerEvents = 'none'
    }
})

function formSubmit() {
    $("[type=submit]").on('click', function (e){ 
        e.preventDefault();
        var form = $(this).closest('.form');
        var url = form.attr('action');
        var form_data = form.serialize();
        var field = form.find('[required]');
        // console.log(form_data);

        empty = 0;

        field.each(function() {
            if ($(this).val() == "") {
                $(this).addClass('invalid');
                // return false;
                empty++;
            } else {
                $(this).removeClass('invalid');
                $(this).addClass('valid');
            }  
        });

        // console.log(empty);

        if (empty > 0) {
            return false;
        } else {        
            $.ajax({
                url: url,
                type: "POST",
                dataType: "html",
                data: form_data,
                success: function (response) {
                    // $('#success').modal('show');
                    // console.log('success');
                    console.log(response);
                    // console.log(data);
                    // document.location.href = "success.html";
                },
                error: function (response) {
                    // $('#success').modal('show');
                    // console.log('error');
                    console.log(response);
                }
            });
        }

    });

    $('[required]').on('blur', function() {
        if ($(this).val() != '') {
            $(this).removeClass('invalid');
        }
    });

    $('.form__privacy input').on('change', function(event) {
        event.preventDefault();
        var btn = $(this).closest('.form').find('.btn');
        if ($(this).prop('checked')) {
            btn.removeAttr('disabled');
            // console.log('checked');
        } else {
            btn.attr('disabled', true);
        }
    });
}

(function ($) {
    // узнать позицию курсора
    $.fn.getCursorPosition = function () {
        var input = this.get(0);
        if (!input) return;
        if ('selectionStart' in input) {
            return input.selectionStart;
        } else if (document.selection) {
            input.focus();
            var sel = document.selection.createRange();
            var selLen = document.selection.createRange().text.length;
            sel.moveStart('character', -input.value.length);
            return sel.text.length - selLen;
        }
    }
    // установить позицию курсора
    $.fn.setCursorPosition = function (pos) {
        if ($(this).get(0).setSelectionRange) {
            $(this).get(0).setSelectionRange(pos, pos);
        } else if ($(this).get(0).createTextRange) {
            var range = $(this).get(0).createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    }
    // удалить выделенный текст
    $.fn.delSelected = function () {
        var input = $(this);
        var value = input.val();
        var start = input[0].selectionStart;
        var end = input[0].selectionEnd;
        input.val(
                value.substr(0, start) + value.substring(end, value.length)
        );
        return end - start;
    };

    $.fn.priceFormat = function () {

        function priceFormatted(element) {
            element = String(element).replace(/[^\d]/g, '');
            if(!element) return '';
            return (String(parseInt(element))).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        }

        $(this)
            // Отмена перетаскивания текста и вставки через контекстное меню
                .bind('contextmenu', function (event) {
                    event.preventDefault();
                })
                .bind('drop', function (event) {
                    var value = $(this).val();
                    $(this).val(''); // хак для хрома
                    $(this).val(value);
                    event.preventDefault();
                })
                .keydown(function (event) {
                    var cursor = $(this).getCursorPosition();
                    var code = event.keyCode;
                    var startValue = $(this).val();
                    if ((event.ctrlKey === true && code == 86) || // Ctrl+V | Shift+insert
                        (event.metaKey === true && code == 86) || 
                            (event.shiftKey === true && code == 45)) {
                        return false;
                    } else if (
                            code == 9 || // tab
                                    code == 27 || // ecs
                                    event.ctrlKey === true || // все что вместе с ctrl
                                    event.metaKey === true ||
                                    event.altKey === true || // все что вместе с alt
                                    event.shiftKey === true || // все что вместе с shift
                                    (code >= 112 && code <= 123) || // F1 - F12
                                    (code >= 35 && code <= 39)) // end, home, стрелки
                    {
                        return;

                    } else if (code == 8) {// backspace

                        var delCount = $(this).delSelected();
                        if (!delCount) {
                            if (startValue[cursor - 1] === ' ') {
                                cursor--;
                            }
                            $(this).val(startValue.substr(0, cursor - 1) + startValue.substring(cursor, startValue.length));
                        }
                        $(this).val(priceFormatted($(this).val()));
                        $(this).setCursorPosition(cursor - (startValue.length - $(this).val().length - delCount));

                    } else if (code == 46) { // delete

                        var delCount = $(this).delSelected();
                        if (!delCount) {
                            if (startValue[cursor] === ' ') {
                                cursor++;
                            }
                            $(this).val(startValue.substr(0, cursor) + startValue.substring(cursor + 1, startValue.length));
                        }
                        if (!delCount)delCount = 1;
                        $(this).val(priceFormatted($(this).val()));
                        $(this).setCursorPosition(cursor - (startValue.length - $(this).val().length - delCount));

                    } else {
                        $(this).delSelected();
                        startValue = $(this).val();
                        var key = false;
                        // цифровые клавиши
                        if ((code >= 48 && code <= 57)) {
                            key = (code - 48);
                        }
                        // numpad
                        else if ((code >= 96 && code <= 105 )) {
                            key = (code - 96);
                        } else {
                            $(this).val(priceFormatted($(this).val()));
                            $(this).setCursorPosition(cursor);
                            return false;
                        }
                        var length = startValue.length
                        var value = startValue.substr(0, cursor) + key + startValue.substring(cursor, startValue.length);
                        $(this).val(priceFormatted(value));
                        $(this).setCursorPosition(cursor + $(this).val().length - startValue.length);
                    }
                    event.preventDefault();
                });
    };
})(jQuery);