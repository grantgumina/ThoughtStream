var transparentDemo = true;
var fixedTop = false;

$(window).scroll(function(e) {
    oVal = ($(window).scrollTop() / 170);
    $(".blur").css("opacity", oVal);

});

// MY CUSTOM CODE
$(document).ready(function() {


    var newTagHTMLString = '<li class="-gg-tag -gg-new-tag">' +
    '<h6 class="small">#new-tag</h6>'+
    '<input type="text" value placeholder="New Tag"' +
    'class="form-control"/>' +
    '</li>';

    // User clicks new tag button
    $('#-gg-new-tag-button').click(function() {
        // TODO - check for empty new tag li's

        var newTagHTMLObject = $.parseHTML(newTagHTMLString);

        var tagCount = $('.-gg-tag').size();

        console.log('tag count: ' + tagCount);
        $(newTagHTMLObject).attr('id', '-gg-tag-' + tagCount);

        // Watch for user filling out tag
        $(newTagHTMLObject).keypress(function(e) {
            if (e.which == 13) {
                // Enter is pressed
                var newTagText = $($(newTagHTMLObject).contents()[1]).val();

                $($(newTagHTMLObject).contents()[0]).html(newTagText);
                $(newTagHTMLObject).removeClass('-gg-new-tag')
            }
        });

        $('#-gg-tags-list').append(newTagHTMLObject);


    });
});
