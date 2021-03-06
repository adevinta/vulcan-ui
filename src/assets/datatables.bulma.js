/*! DataTables Bulma integration */
/**
 * DataTables integration for Bulma.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bulma.
 *
 * Modified from https://github.com/florenperetti/datatables-bulma-plugin
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery', 'datatables.net'], function ($) {
            return factory($, window, document);
        });
    } else if (typeof exports === 'object') {
        // CommonJS
        module.exports = function (root, $) {
            if (!root) {
                root = window;
            }

            if (!$ || !$.fn.dataTable) {
                // Require DataTables, which attaches to jQuery, including
                // jQuery if needed and have a $ property so we can access the
                // jQuery object that is used
                $ = require('datatables.net')(root, $).$;
            }

            return factory($, root, root.document);
        };
    } else {
        // Browser
        factory(jQuery, window, document);
    }
}(function ($, window, document, undefined) {
    'use strict';

    var DataTable = $.fn.dataTable;

    /* Set the defaults for DataTables initialisation */
    $.extend(true, DataTable.defaults, {
        dom: "<<'columns'" +
            "<'column is-2'l>f<'column'<'buttons is-pulled-right delete_position'>>>" +
            "<'content columns'" +
            "<'column is-12'tr>>" +
            "<'columns'" +
            "<'column is-12'i>" +
            ">" +
            "<'columns'" +
            "<'column is-12'p>" +
            ">>",
        renderer: 'bulma'
    });

    /* Default class modification */
    $.extend(DataTable.ext.classes, {
        sWrapper: "dataTables_wrapper form-inline",
        sFilterInput: "input",
        sProcessing: "dataTables_processing panel panel-default",
        sPageButton: "pagination-link",
        sPageButtonActive: "is-current",
        sPagePrevious: "pagination-previous",
        sPageNext: "pagination-next",

    });

    /* Bulma paging button renderer */
    DataTable.ext.renderer.pageButton.bulma = function (settings, host, idx, buttons, page, pages) {
        var api = new DataTable.Api(settings);
        var classes = settings.oClasses;
        var lang = settings.oLanguage.oPaginate;
        var aria = settings.oLanguage.oAria.paginate || {};
        var btnDisplay, btnClass, btnAttribute, counter = 0;

        var attach = function (container, buttons) {
            var i, ien, node, button;
            var clickHandler = function (e) {
                e.preventDefault();
                if (!$(e.currentTarget).hasClass('is-disabled') && api.page() != e.data.action) {
                    api.page(e.data.action).draw('page');
                }
            };

            for (i = 0, ien = buttons.length; i < ien; i++) {
                button = buttons[i];

                if ($.isArray(button)) {
                    attach(container, button);
                } else {
                    btnDisplay = '';
                    btnClass = '';
                    btnAttribute = '';

                    switch (button) {
                        case 'ellipsis':
                            btnDisplay = '&#x2026;';
                            btnClass = 'pagination-link is-disabled';
                            btnAttribute = 'disabled';
                            break;

                        case 'first':
                            btnDisplay = lang.sFirst;
                            btnClass = "previous " + button + (page > 0 ? '' : ' is-disabled');
                            btnAttribute = page > 0 ? '' : 'disabled';
                            break;

                        case 'previous':
                            btnDisplay = lang.sPrevious;
                            btnClass = button + (page > 0 ? '' : ' is-disabled');
                            btnAttribute = page > 0 ? '' : 'disabled';
                            break;

                        case 'next':
                            btnDisplay = lang.sNext;
                            btnClass = button + (page < pages - 1 ? '' : ' is-disabled');
                            btnAttribute = page < pages - 1 ? '' : 'disabled';
                            break;

                        case 'last':
                            btnDisplay = lang.sLast;
                            btnClass = 'next ' + button + (page < pages - 1 ? '' : ' is-disabled');
                            btnAttribute = page < pages - 1 ? '' : 'disabled';
                            break;

                        default:
                            btnDisplay = button + 1;
                            btnClass = page === button ? 'is-current' : '';
                            btnAttribute = '';
                            break;
                    }

                    if (btnDisplay) {
                        if (button === 'previous' || button === 'next') {
                            node = $('<a>', {
                                'class': 'pagination-' + btnClass,
                                'id': idx === 0 && typeof button === 'string' ?
                                    settings.sTableId + '_' + button : null,
                                'href': '#',
                                'aria-controls': settings.sTableId,
                                'aria-label': aria[button],
                                'data-dt-idx': counter,
                                'tabindex': settings.iTabIndex
                            }).html(btnDisplay).prependTo(container);

                            if (btnAttribute === 'disabled') {
                                node.attr('disabled', 'disabled');
                            }
                        } else {

                            let numberButton = $('<a>', {
                                'class': classes.sPageButton + ' ' + btnClass,
                                'href': '#',
                                'aria-controls': settings.sTableId,
                                'aria-label': aria[button],
                                'data-dt-idx': counter,
                                'tabindex': settings.iTabIndex
                            }).html(btnDisplay);

                            let listItem = $('<li>', {
                                'id': idx === 0 && typeof button === 'string' ?
                                    settings.sTableId + '_' + button : null
                            });

                            if (btnAttribute === 'disabled') {
                                listItem.addClass('is-disabled');
                                numberButton.attr('disabled', 'disabled');
                            }

                            node = listItem
                                .append(numberButton)
                                .appendTo(container);
                        }

                        settings.oApi._fnBindAction(
                            node, {
                                action: button
                            }, clickHandler
                        );

                        counter++;
                    }
                }
            }
        };

        // IE9 throws an 'unknown error' if document.activeElement is used
        // inside an iframe or frame.
        var activeEl;

        try {
            // Because this approach is destroying and recreating the paging
            // elements, focus is lost on the select button which is bad for
            // accessibility. So we want to restore focus once the draw has
            // completed
            activeEl = $(host).find(document.activeElement).data('dt-idx');
        } catch (e) {}

        let navButtons = [];
        let midElementIndex = buttons.length > 3 ? 2 : 1;

        for (let i = 0; i < buttons.length; i++) {
            i !== midElementIndex && navButtons.push(buttons[i]);
        }

        let next = navButtons.indexOf('next');
        if (next !== -1) {
            navButtons.splice(next, 1);
            navButtons.push('next');
        }

        let previous = navButtons.indexOf('previous');
        if (previous !== -1) {
            navButtons.splice(previous, 1);
            navButtons.unshift('previous');
        }

        attach(
            $(host).empty().html('<ul class="pagination-list"/>').children('ul'),
            buttons[midElementIndex]
        );

        $(host).find('.pagination-list').wrap('<nav class="pagination is-centered"></nav>');

        attach(
            $(host).find('nav'),
            navButtons
        );

        if (activeEl !== undefined) {
            $(host).find('[data-dt-idx=' + activeEl + ']').focus();
        }

        /*('#' + settings.sInstance + '_wrapper label > select').wrap('<span class="select"></span>');
        let searchInput = $('#' + settings.sInstance + '_filter>label').find('input').detach();
        if (searchInput.length > 0) {
            searchInput.addClass('is-fullwidth');
            let label = $('#' + settings.sInstance + '_filter>label').wrap('<div class="control-label"></div>');

            label.parent().parent().append(searchInput).addClass('control is-horizontal');
        }*/

        $('#' + settings.sInstance + "_processing").html(
            '<div class="modal is-active"><div class="modal-content modal-loading"><div class="box box-loading">Bezig...</div></div></div>'
        );
    };

    return DataTable;
}));
