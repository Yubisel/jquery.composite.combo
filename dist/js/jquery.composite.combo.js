/*!
 * Composite Combo v 1.0
 * =====================
 * (c) 2017
 * @utor: Ing. Yubisel Vega Alvarez
 * e-mail: yubisel@nauta.cu
 * e-mail: yubiselv@gmail.com
 * cel: (+53)53924552
 *
 * MIT Licensed
*/

;(function( $ ){
    'use strict';
    var idCounter = 0;

    var uniqueId = function (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    };

    var methods = {
        setValues: function (l1, l2) {
            var self = this.data('compositeCombo');
            if ((l1 != null) && (l1 != '')){
                var desc_l1  = self.getDescObj(l1);
                self.cc.find('.cc_SearchLevel_1').html('').addClass('selected').append(
                    $('<span>').html(desc_l1),
                    $('<span>')
                        .addClass('icon-close')
                        .on('click', function (e) {
                            e.stopPropagation();
                            self.buildFirstLevel(self.id)
                        })
                );
                if ((l2 != null) && (l2 != '')) {
                    var desc_l2  = self.getDescObj(l1, l2);
                    self.cc.find('.cc_topSearchDesc').html('').hide();
                    self.cc.find('.cc_SearchLevel_2').html('').show().addClass('selected').append(
                        $('<span>').html(desc_l2),
                        $('<span>')
                            .addClass('icon-close')
                            .on('click', function (e) {
                                e.stopPropagation();
                                self.buildSecondLevel(self.id, l1);
                            })
                    );
                    self.cc.find('.cc_ListContainer').hide();
                }else{
                    self.buildSecondLevel(self.id, l1);
                }
            }else{
                $.error( 'Los argumentos pasados no pueden ser nulos o vacios' );
            }
        },
        getValues: function () {
            var self = this.data('compositeCombo');
            return {
                level1: self.element.data('level_1'),
                level2: self.element.data('level_2')
            }
        }
    };

    function compositeCombo(element, options) {
        var self = this;
        this.id = uniqueId('cc_');

        var tpl = [
            '<div class="cc_compositeCombo" id="' + self.id + '">',
            '<div class="cc_marker_container"><span class="cc_marker"><span class="cc_marker_inner"></span></span></div>',
            '<div class="cc_topSearchDesc"></div>',
            '<div class="cc_SearchLevel_1"></div>',
            '<div class="cc_SearchLevel_2"></div>',
            '<div class="cc_ListContainer"><ul>',
            '</ul></div>',
            '</div>'
        ].join('');

        this.element = element;
        this.cc = $(tpl);
        this.opts = $.fn.extend({}, $.fn.compositeCombo.defaults, options);;
        this.elementOffset = element.offset();
        this.styles = {
            composite: {
                top: self.elementOffset.top + self.element.height() + 15,
                left: self.elementOffset.left,
                width: self.opts.width,
                // height: self.opts.height,
                'max-height': self.opts.height
            },
            marker:{
                left: {'left': '10px', 'right': 'unset'},
                middle: {'left': 'calc(50% - 7px)', 'right': 'unset'},
                right: {'left': 'unset', 'right': '10px'}
            }
        };

        $(self.element)
            .attr({
                'data-composite_id': self.id
            })
            .on('click focus', function (e) {
                e.stopPropagation();
                $('#' + $(element).data('composite_id')).addClass('open');
                self.calcHeight(self.cc.find('.cc_ListContainer ul'));
            });

        self.locate();
        self.cc.css(self.styles.composite);

        self.element.val(self.opts.textLevel1);
        self.element.attr('readonly', true);

        $('body').append(self.cc);
        self.buildFirstLevel(self.id);

        $('html').click(function() {
            $('.cc_compositeCombo').removeClass("open")
        });

        $('.cc_compositeCombo').on('click', function (e) {
            e.stopPropagation();
        });
    };

    compositeCombo.prototype.locate = function () {
        var self = this;
        var $marker = self.cc.find('.cc_marker');
        switch (self.opts.placement) {
            case 'left':
                self.styles.composite.left = self.elementOffset.left;
                break;
            case 'middle':
                self.styles.composite.left = self.elementOffset.left + (self.element.outerWidth() / 2) - (self.opts.width / 2);
                break;
            case 'right':
                self.styles.composite.left = self.elementOffset.left + self.element.outerWidth() - self.opts.width;
                break;
        }
        $marker.css(self.styles.marker[self.opts.placement]);

        if (self.opts.showMarker){
            $marker.parent().show();
            if (self.opts.markerPlacement != 'default') {
                $marker.css(self.styles.marker[self.opts.markerPlacement]);
            }
        }else{
            $marker.parent().hide();
        }
    };

    compositeCombo.prototype.buildFirstLevel = function (id) {
        var self = this;
        if(self.opts.showSearchDesc) {
            self.cc.find('.cc_topSearchDesc').html(self.opts.topSearchDesc).show();
        }else{
            self.cc.find('.cc_topSearchDesc').html('').hide();
        }
        self.cc.find('.cc_SearchLevel_1').removeClass('selected').html(self.opts.textLevel1);
        self.cc.find('.cc_SearchLevel_2').html('').hide();

        var $ul = $('#' + id).find('ul').html('').show();
        $ul.parent().show();
        $.each(self.opts.elements, function (idx, elem) {
            $ul.append(
                $('<li>')
                    .attr({
                        'data-id': elem.id,
                        'data-description': elem.desc
                    })
                    .on('click', function (e) {
                        e.stopPropagation();
                        self.cc.find('.cc_topSearchDesc').html(self.opts.textLevel2)
                        self.cc.find('.cc_SearchLevel_1').html('').addClass('selected').append(
                            $('<span>').html(elem.desc),
                            $('<span>')
                                .addClass('icon-close')
                                .on('click', function (e) {
                                    e.stopPropagation();
                                    self.element.removeData('level_1');
                                    self.element.removeData('level_2');
                                    self.element.val(self.opts.textLevel1);
                                    self.buildFirstLevel(id)
                                })
                        );
                        self.element.data('level_1', elem).val(elem.desc);
                        self.buildSecondLevel(id, elem.id);
                    })
                    .html(elem.desc)
            )
        });
        self.calcHeight($ul);
    };

    compositeCombo.prototype.buildSecondLevel = function (id, id_elem) {
        var self = this;
        self.cc.find('.cc_topSearchDesc').html(self.opts.textLevel2).show();
        self.cc.find('.cc_SearchLevel_2').html('').hide();
        var $ul = $('#' + id).find('ul').html('');
        $ul.parent().show();
        $.each(self.opts.elements, function (idx, elem) {
            if(elem.id == id_elem){
                $.each(elem.subElement, function (idx, elem) {
                    $ul.append(
                        $('<li>')
                            .attr({
                                'data-id': elem.id,
                                'data-description': elem.desc
                            })
                            .on('click', function (e) {
                                e.stopPropagation();
                                self.cc.find('.cc_topSearchDesc').html('').hide();
                                self.cc.find('.cc_SearchLevel_2').html('').show().addClass('selected').append(
                                    $('<span>').html(elem.desc),
                                    $('<span>')
                                        .addClass('icon-close')
                                        .on('click', function (e) {
                                            e.stopPropagation();
                                            self.element.removeData('level_2');
                                            self.element.val(self.element.data('level_1').desc);
                                            self.buildSecondLevel(id, id_elem);
                                        })
                                );
                                self.element.data('level_2', elem).val(self.element.val() + ', ' + elem.desc);
                                $ul.parent().css('height', '').hide();
                            })
                            .html(elem.desc)
                    );
                });
                self.calcHeight($ul);
            }
        })
    };

    compositeCombo.prototype.calcHeight = function ($ul) {
        var self = this;
        $ul.parent().css({
            height: ($ul.height() < (self.opts.height - 75)) ? 'auto' : self.opts.height - 75
        });
    };

    compositeCombo.prototype.getDescObj = function (id_l1, id_l2) {
        var self = this;
        if ((id_l2 == null) || (id_l2 == '')) {
            for (var i = 0, l = self.opts.elements.length; i < l; i++) {
                if (self.opts.elements[i].id == id_l1) {
                    return self.opts.elements[i].desc;
                }
            }
        }else {
            for (var i = 0, l = self.opts.elements.length; i < l; i++) {
                if (self.opts.elements[i].id == id_l1) {
                    for (var k = 0, j = self.opts.elements[i].subElement.length; k < j; k++){
                        if (self.opts.elements[i].subElement[k].id == id_l2){
                            return self.opts.elements[i].subElement[k].desc;
                        }
                    }
                }
            }
        }
    };

    $.fn.compositeCombo = function( method ) {
        // Method calling logic
        if ( methods[method] ) {
            var args = Array.prototype.slice.call( arguments, 1 );
            return methods[ method ].apply( this, args);
        } else if ( typeof method === 'object' || ! method ) {
            return this.each(function() {
                var $this = $(this);
                $this.data('compositeCombo', new compositeCombo($this, method));
            });
        } else {
            $.error( 'Method ' +  method + ' does not exist on jQuery.compositeCombo' );
        }
    };

    $.fn.compositeCombo.defaults = {
        showSearchDesc: true,
        topSearchDesc: '¿Qué quieres buscar?',
        textLevel1: 'Todo',
        textLevel2: 'Selecciona un subnivel',
        height: 280,
        width: 300,
        placement: 'middle', //posible values {left, middle, right}
        showMarker: true,
        markerPlacement: 'default',//posible values {left, middle, right} by default it's aligned at the same position that the dialog
        elements: [
            {
                id: 1,
                desc: 'Opcion 1',
                subElement: [
                    {
                        id: 2,
                        desc: 'subOption2'
                    },
                    {
                        id: 3,
                        desc: 'subOption3'
                    },
                    {
                        id: 4,
                        desc: 'subOption4'
                    },
                    {
                        id: 5,
                        desc: 'subOption5'
                    },
                    {
                        id: 6,
                        desc: 'subOption6'
                    },
                    {
                        id: 7,
                        desc: 'subOption7'
                    },
                    {
                        id: 8,
                        desc: 'subOption8'
                    }
                ]
            },
            {
                id: 2,
                desc: 'Opcion 2',
                subElement: [
                    {
                        id: 9,
                        desc: 'subOption9'
                    },
                    {
                        id: 10,
                        desc: 'subOption10'
                    },
                    {
                        id: 11,
                        desc: 'subOption11'
                    },
                    {
                        id: 12,
                        desc: 'subOption12'
                    },
                    {
                        id: 13,
                        desc: 'subOption13'
                    },
                    {
                        id: 14,
                        desc: 'subOption14'
                    },
                    {
                        id: 15,
                        desc: 'subOption15'
                    }
                ]
            },
            {
                id: 3,
                desc: 'Opcion 3',
                subElement: [
                    {
                        id: 16,
                        desc: 'subOption16'
                    },
                    {
                        id: 17,
                        desc: 'subOption17'
                    },
                    {
                        id: 18,
                        desc: 'subOption18'
                    },
                    {
                        id: 19,
                        desc: 'subOption19'
                    },
                    {
                        id: 20,
                        desc: 'subOption20'
                    },
                    {
                        id: 21,
                        desc: 'subOption21'
                    },
                    {
                        id: 22,
                        desc: 'subOption22'
                    }
                ]
            }
        ]
    };
})( jQuery );