'use restrict'

jQuery(document).ready(function () {

    build_ui();

    $('#tab-collections li').first().find('a').addClass('active');
    $('#tab-collections-content>div').first().addClass('active');

});

function build_ui() {

    /*{"_id":"5ddd6f3bd2b0da2d347bc221",
        "Name":"Leonidas",
        "LastName":"Pereira",
        "RegistrationDate":"11-09-2016",
        "Co-op":"Y",
        "GPA":3.2,
        "GraduationDate":"20-04-2019"} */

    let student_collection_fields = [
        new CollectionField('ID', '_id', 'text', false, 'disabled="disabled"'),
        new CollectionField('Name', 'Name', 'text', true),
        new CollectionField('Last Name', 'LastName', 'text', true),
        new CollectionField('Registration Date', 'RegistrationDate', 'date', true),
        new CollectionField('Co-op', 'Co-op', 'radio', false, '', false, [{ name: 'YES', value: 'Y' }, { name: 'NO', value: 'N' }]),
        new CollectionField('GPA', 'GPA', 'text', true),
        new CollectionField("Graduation Date", 'GraduationDate', 'date', false)
    ];

    let student_collection_generator = new CollectionGenerator('Cestar_C0740134', student_collection_fields);
    student_collection_generator.handle_ui();// For all collections
    student_collection_generator.set_up_modal();// Only for the first on collection
    student_collection_generator.load_table();// Only for the first on collection

    // TODO: Remove this...
    let cool_collection_fields = [
        new CollectionField('ID', '_id', 'text', false, 'disabled="disabled"'),
        new CollectionField('Name', 'Name', 'text', true),
        new CollectionField('Last Name', 'LastName', 'text', true),
        new CollectionField('Rating', 'rating', 'number', true)];

    let cool_collection_generator = new CollectionGenerator('Cool_List', cool_collection_fields);
    cool_collection_generator.handle_ui();// For all collections

    // Flavio Noe...
    let flavio_collection_fields = [
        new CollectionField('ID', '_id', 'text', false, 'disabled="disabled"'),
        new CollectionField('Full Name', 'fullName', 'text', true),
        new CollectionField('Date of Birth', 'dob', 'date', true),
        new CollectionField('Gender', 'gender', 'radio', false, '', false, [{ name: 'Male', value: 'M' }, { name: 'Female', value: 'F' }]),
        new CollectionField('Address', 'address', 'text', false)];

    let flavio_generator = new CollectionGenerator('Flavio_C0740832', flavio_collection_fields);
    flavio_generator.handle_ui();
        
    //Karanvir Banwait
    let C0747562_collection_fields = [
        new CollectionField('ID', '_id', 'text', false, 'disabled="disabled"'),
        new CollectionField('Street Name', 'fullName', 'text', true),
        new CollectionField('Length', 'length', 'text', true),
        new CollectionField('Description', 'description', 'text',true)
        ];

    let karan_generator = new CollectionGenerator('Karanvir_C0747562', C0747562_collection_fields);
    karan_generator.handle_ui();
}





