let data = {"saved":true}

//user_id = get data-id value;

//event listener to the save button 
$.ajax({
    type: 'PUT',
    url: '/submit/:id',
    contentType: 'application/json',
    data: JSON.stringify(data), // access in body
}).done(function () {
    console.log('SUCCESS');
}).fail(function (msg) {
    console.log('FAIL');
}).always(function (msg) {
    console.log('ALWAYS');
});