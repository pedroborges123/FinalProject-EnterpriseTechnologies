'use restrict'

const url_server = "http://localhost:3000/api/";// change this..

class CollectionField {

    /**
     *
     * @param {string} field_name Name that will show up on table Header, Buttons and Modal header
     * @param {string} field_key key that has to be exactly the same as the mongodb
     * @param {string} field_type html input types [text, email, number, checkbox, radio, date, select, list,  ...]
     * @param {boolean} is_required if the input is requeried or not on the form
     * @param {string} payload other configurations that you could add on input
     * @param {boolean} is_list define if the field or select is multi-value, and show as a list.
     * @param {list} options is a list of objects like [{name: "some string", value: "some object"}, ...]
     */
    constructor(field_name, field_key, field_type, is_required, payload = '', is_list = false, options = []) {
        this.name = field_name;
        this.key = field_key;
        this.type = field_type;
        this.is_required = is_required;
        this.payload = payload;
        this.is_list = is_list;
        this.options = options;

    }

    build_field() {

        if (this.type == 'select') {
            return this.build_select();
        } else if (this.type == 'checkbox' || this.type == 'radio') {
            return this.build_checkbox();
        } else {
            return this.build_input();
        }

    }

    build_input() {

        let content = `<div class="form-group">
                        <label for="Input-${this.key}">${this.name}</label>
                        <input type="${this.type}" class="form-control" id="Input-${this.key}" name="${this.key}" required="${this.is_required}" placeholder="${this.name}" ${this.payload}>
                    </div>`;

        return content;
    }

    build_select() {
        let content = `<div class="form-group">
                        <label for="Input-${this.key}">${this.name}</label>
                        <select id="input-${this.key}" name="${this.key}" multiple="${this.is_list}" class="form-control">
                            ${this.buid_select_options()}
                        </select>
                    </div>`;

        return content;
    }

    buid_select_options() {
        let content = '';
        this.options.forEach(el => {
            content += `<option value="${el.value}" >${el.name}</option>`;
        });

        return content;
    }

    build_checkbox() {
        let content = `<fieldset class="form-group">
                  <legend class="pt-0">${this.name}</legend>`;
        let _self = this;
        this.options.forEach(el => {
            content += `<div class="form-group form-check">
                            <input type="${_self.type}" class="form-check-input" id="input-${_self.key}" name="${_self.key}" value="${el.value}">
                            <label class="form-check-label" for="input-${_self.key}">${el.name}</label>
                        </div>`;
        });
        content += '</fieldset>';
        return content;
    }

}

class CollectionGenerator {

    /**
    * @param {string} collection_name
    * @param {list<CollectionField>} collection_fields
    */
    constructor(collection_name, collection_fields) {
        this.name = collection_name;
        this.url_base = url_server;
        this.fields = collection_fields;
        this.list = [];
        this.set_up_html();
    }

    set_up_html() {
        $('#tab-collections').append(this.build_tab());
        $('#tab-collections-content').append(this.build_tab_content());

    }

    build_tab() {
        let content = `<li class="nav-item">
                        <a class="nav-link" id="${this.name.replace(' ', '_')}-tab" data-toggle="tab" href="#${this.name.replace(' ', '_')}" role="tab"
                            aria-controls="${this.name.replace(' ', '_')}" aria-selected="false">${this.name}</a>
                        </li>`;
        return content;
    }

    build_tab_content() {
        let content = `<div class="tab-pane fade show" id="${this.name.replace(' ', '_')}" role="tabpanel" aria-labelledby="${this.name.replace(' ', '_')}">
                            <div class="row">
                                <div class="col-lg-12">
                                    <h2>${this.name} ${this.build_add_new()}</h2>
                                    ${this.build_table()}
                                    ${this.build_add_new()}
                                </div>
                            </div>
                        </div>`;

        return content;
    }

    build_table() {
        let content = `<table id="${this.name.replace(' ', '_')}-table" class="table table-striped">
                        ${this.build_table_header()}
                        ${this.build_table_body()}
                        ${this.build_table_footer()}
                        </table>`;
        return content;
    }

    build_table_header() {
        let content = `<thead class="thead-dark">
                        <tr>`;
        this.fields.forEach(element => {
            content += `<th scope="col">${element.name}</th>`;
        });
        content += `<th scope="col">Actions</th>
                    </tr>
                    </thead>`;

        return content;
    }

    build_table_footer() {
        let content = `<tfoot class="thead-dark">
                        <tr>`;
        this.fields.forEach(element => {
            content += `<th scope="col">${element.name}</th>`;
        });
        content += `<th scope="col">Actions</th>
                    </tr>
                    </tfoot>`;

        return content;
    }

    build_table_body() {
        let content = `<tbody>${this.build_table_row()}</tbody>`;
        return content;

    }

    build_table_row() {
        let content = '';
        if (this.list.length > 0) {
            let _self = this;
            this.list.forEach(row => {
                content += '<tr>';

                _self.fields.forEach(el => {
                    if (_self.isObject(row[el.key])) {
                        content += `<td>${_self.build_row_content_object(row[el.key])}</td>`;
                    } else if (_self.isArray(row[el.key])) {
                        content += `<td>${_self.build_row_content_array(row[el.key])}</td>`;

                    } else {
                        content += `<td>${row[el.key]}</td>`;
                    }

                });
                content += `<td>${_self.build_table_col_action(row)}</td>`;
                content += '</tr>';
            });

        } else {
            let size = this.fields.length + 1;
            content += `<tr><td colspan="${size}">No Data Found</td></tr>`;
        }

        return content;
    }

    build_row_content_object(object) {
        let content = '';
        Object.keys(object).forEach( x  => {
            content += `<p>${x} : ${object[x]}</p>`;
        });
        return content;
    }

    build_row_content_array(array) {
        let content = '';
        array.forEach( x => {
            content += `<p>${x}</p>`;
        });
        return content;
    }

    build_table_col_action(item) {
        let buttons = `<div class="dropdown">
        <a class="btn btn-secondary dropdown-toggle" data-id="${item._id}" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <i class="fa fa-cog"></i>
        </a>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
          <a class="dropdown-item edit-item" data-id="${item._id}" href="#">Edit</a>
          <a class="dropdown-item delete-item" data-id="${item._id}" href="#">Delete</a>
        </div>
      </div>`;
        return buttons;

    }

    build_modal_header() {
        let content = `<h5 class="modal-title">${this.name}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>`;
        return content;
    }

    build_modal_content() {
        let content = `<form id="form">
                        ${this.build_modal_form_inputs()}
                      </form>`;

        return content;
    }

    build_modal_form_inputs() {
        let content = '';
        this.fields.forEach(el => {
            content += el.build_field();
        });

        return content;
    }

    build_add_new() {
        let content = `<button type="button" data-collection="${this.name}" class="btn btn-primary add-new float-right">Add New ${this.name}</button>`;
        return content;
    }

    set_up_modal() {
        $('#modal .modal-header').html(this.build_modal_header());
        $('#modal .modal-body').html(this.build_modal_content());
        $('button.save-action').unbind();

        let _self = this;
        $('#modal').on('shown.bs.modal', function () {
            $('#modal .modal-body input:first').trigger('focus');
        });

        $('.modal').on('hidden.bs.modal', function () {
            $(this).find('form').trigger("reset");
        });

        $('button.save-action').click(function () {
            console.log($(this).data());

            let action = $(this).data('action');

            let method = 'POST';
            if (action == 'update') {
                $('form input[name="_id"]').prop("disabled", false);
                method = 'PUT';
            }
            let vals = _self.getFormData(jQuery('#modal form'));

            _self.ajax_call(_self.url_base, vals, method, $('button.save-action'), (status, ret) => {
                if (status == 'success') {
                    $('form').trigger("reset");
                    _self.load_table();
                    $('form input[name="_id"]').prop("disabled", true);
                    $('.modal').modal('hide');
                }
            });

        });

    }

    handle_ui() {
        let _self = this;

        $(`button.add-new[data-collection="${_self.name}"]`).click(function () {

            $('#modal button.save-action').data('action', 'save');
            $('#modal button.save-action').data('collection', _self.name);//TODO:take a look
            $('#modal').modal();
        });

        $(`ul #${this.name.replace(' ', '_')}-tab`).click(function () {
            _self.set_up_modal()
            _self.load_table();
        });

        //this.load_table();
    }

    load_table() {
        let _self = this;

        this.ajax_call(this.url_base, undefined, 'GET', jQuery(`table#${this.name.replace(' ', '_')}-table tbody`), (status, ret) => {

            if (status == 'success') {

                _self.list = ret.result;

                jQuery(`table#${this.name.replace(' ', '_')}-table tbody`).html(_self.build_table_row());
                _self.handle_table_actions();

            } else {
                //TODO: add error handler
            }
        });
    }

    handle_table_actions() {
        let _self = this;
        $('a.edit-item').unbind();
        $('a.delete-item').unbind();

        $('a.edit-item').click(function (e) {
            e.preventDefault();
            let _id = $(this).data('id');
            console.log(_id);

            let item = _self.list.filter(x => {
                if (x._id == _id) {
                    return x;
                }
            })[0];

            Object.keys(item).forEach(x => {
                let el = $('form').find('[name="' + x + '"]')[0];
                let form_type = el.localName;

                if (form_type == 'select') {
                    $(el).val(item[x]);

                } else {
                    let type = $(el).prop('type');
                    if (type == "checkbox" || type == 'radio') {
                        $('form').find('input[name="' + x + '"][value="' + item[x] + '"]').attr('checked', 'checked');
                    } else {
                        $(el).val(item[x]);
                    }
                }

            });

            $('button.save-action').data('action', 'update');

            $('#modal').modal();
        });

        $('a.delete-item').click(function (e) {
            e.preventDefault();
            let _id = $(this).data('id');
            console.log(_id);
            let target = jQuery(`table#${this.name.replace(' ', '_')}-table tbody`);

            _self.ajax_call(_self.url_base + _id, _id, 'DELETE', target, (status, ret) => {
                if (status == 'success') {
                    _self.load_table();
                }
            });
        });
    }

    ajax_call(url, data = undefined, method, target, callback) {

        let collection = this.name;

        jQuery.ajax({
            url: url,
            type: method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            beforeSend: function (jqXHR, settings) {
                jqXHR.setRequestHeader('collection_name', collection);
                jQuery(target).append('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>');
            },
            success: function (result, status, xhr) {
                console.log(status);
                callback(status, result);
            },
            error: function (xhr, status, error) {
                console.error(error);
                callback(status, error);
            }, complete: function () {
                jQuery(target).find('.spinner-border').remove();
            }
        });

    }

    getFormData($form) {
        var unindexed_array = $form.serializeArray();
        var indexed_array = {};

        $.map(unindexed_array, function (n, i) {
            indexed_array[n['name']] = n['value'];
        });

        return indexed_array;
    }

    isObject(value) {
        return value && typeof value === 'object' && value.constructor === Object;
    }

    isArray(value) {
        return value && typeof value === 'object' && value.constructor === Array;
    }

}

