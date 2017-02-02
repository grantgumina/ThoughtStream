var transparentDemo = true;
var fixedTop = false;

$(window).scroll(function(e) {
    oVal = ($(window).scrollTop() / 170);
    $(".blur").css("opacity", oVal);
});

var quill;

// TEST DATA
let tagsJSON = [
    {
        "id": "rexxxkd0",
        "name": "culture"
    },
    {
        "id": "sfg00sad",
        "name": "history"
    },
    {
        "id": "X3bxadf2",
        "name": "music"
    }
];

let documentPreviewsForTagIdJSON = {};
documentPreviewsForTagIdJSON['rexxxkd0'] = [ // Culture
     {
        'id': '893fxjx0',
        'title': 'JBP - MM1',
        'preview': 'Hello world!',
        'type': 'note',
        'date': 'Fri May 04 2015 01:17:07 GMT-0700 (PDT)'
    },
    {
        'id': '199437adx',
        'title': 'My Heritage',
        'preview': 'FOOBAR NOOBAR',
        'type': 'essay',
        'date': 'Th July 14 2016 05:17:07 GMT-0700 (PDT)'
    }
];

documentPreviewsForTagIdJSON['sfg00sad'] = [ // History
    {
       'id': '893fxjx0',
       'title': 'JBP - MM1',
       'preview': 'Hello world!',
       'type': 'note',
       'date': 'Fri May 04 2015 01:17:07 GMT-0700 (PDT)'
   }
];

documentPreviewsForTagIdJSON['X3bxadf2'] = [
    {
        'id': '199437adx',
        'title': 'My Heritage',
        'preview': 'FOOBAR NOOBAR',
        'type': 'essay',
        'date': 'Th July 14 2016 05:17:07 GMT-0700 (PDT)'
    }
];

let cardsJSON = {};
cardsJSON['893fxjx0'] = {
    'title': 'JBP - MM1',
    'body': 'Hello world!',
    'type': 'note',
    'tags': [{'id': 'rexxxkd0', 'name': 'culture'}, {'id': 'sfg00sad', 'name': 'history'}],
    'date': 'Fri May 04 2015 01:17:07 GMT-0700 (PDT)'
};

cardsJSON['199437adx'] = {
    'id': '199437adx',
    'title': 'My Heritage',
    'body': 'FOOBAR NOOBAR!',
    'type': 'essay',
    'tags': [{'id': 'rexxxkd0', 'name': 'culture'}, {'id': 'X3bxadf2', 'name': 'music'}],
    'date': 'Th July 14 2016 05:17:07 GMT-0700 (PDT)'
};

// CUSTOM HELPER FUNCTIONS
function renderTags() {
    $('#-gg-tags-list').empty();

    for(var i = 0; i < tagsJSON.length; i++) {
        var tag = tagsJSON[i];
        renderTag(tag);
    }
}

// Renders tags seen in sidebar
function renderTag(tag ) {
    var tagHTMLString = '';

    if (tag['name'] == '') {
        tagHTMLString = `
        <li class="-gg-tag" id="` + tag["id"] + `">
            <h6 class="small"></h6>
            <input type="text" value placeholder="Tag Name" class="form-control"/>
        </li>`;
    } else {
        tagHTMLString = `
        <li class="-gg-tag" id="` + tag["id"] + `">
            <h6 class="small">` + tag['name'] + `</h6>
            <input type="text" value placeholder="Tag Name" class="form-control"/>
        </li>`;
    }

    var tagObject = $.parseHTML(tagHTMLString);

    if (tag['name'] == '') {
        $($(tagObject).contents()[1]).hide(); // h6
        $($(tagObject).contents()[3]).show(); // input
    } else {
        $($(tagObject).contents()[1]).show(); // h6
        $($(tagObject).contents()[3]).hide(); // input
    }

    // User creates new tag
    $(tagObject).keypress(function(e) {
        if (e.which == 13) {
            // Enter is pressed
            var newTagText = $($(tagObject).contents()[3]).val();

            // Update the tag data structure
            var numTags = tagsJSON.length;
            tagsJSON[numTags - 1]['name'] = newTagText;

            // Make UI changes
            $($(tagObject).contents()[1]).html(newTagText);
            $($(tagObject).contents()[1]).show(); // h6
            $($(tagObject).contents()[3]).hide(); // input
        }
    });

    // User navigates to new tag
    $(tagObject).click(function(e) {
        // get tag ID
        var tagId = e.target.id;

        if (tagId == "")
            tagId = e.target.parentNode.id;

        showTiles();
        showDocumentsForTag(tagId);

        // Reset filter UI
        $('.-gg-section-group li').removeClass('active');
        $('#-gg-all-button').addClass('active');
    });

    $('#-gg-tags-list').append(tagObject);
}

function showDocumentsForTag(tagId) {
    $('.-gg-content-cards').empty();

    // Switch active tag
    var tagsList = $('#-gg-tags-list');
    $('#-gg-tags-list li').removeClass('active');
    $('#' + tagId).addClass('active');

    // Build HTML cards from active tag
    var cardObjects = buildCardObjectsForTag(tagId);
    for (var i = 0; i < cardObjects.length; i++) {
        $('.-gg-content-cards').append(cardObjects);
    }

    update();
}

function buildCardObjectsForTag(tagId) {
    // Check to see if this tag doesn't have any document previews
    if (!documentPreviewsForTagIdJSON[tagId]) {
        return '';
    }

    var documentPreviewObjects = [];

    for (var i = 0; i < documentPreviewsForTagIdJSON[tagId].length; i++) {
        var documentPreviewJSON = documentPreviewsForTagIdJSON[tagId][i];
        var newCardHTML = '';

        var dpDate = new Date(documentPreviewJSON['date']);
        var momentDate = moment(dpDate).format('MMM Do, YYYY');

        var dpId = documentPreviewJSON['id'];

        if (documentPreviewJSON['type'] == 'note') {
            newCardHTML = '<div class="card col-md-3 -gg-note-card" z-default="1" z-hover="2">' +
                '<h5>' + documentPreviewJSON['title'] + '</h5>' +
                '<p class="small">' + documentPreviewJSON['preview'] + '</p>' +
                '<span>' + momentDate + '</span>' +
            '</div>';
        } else if (documentPreviewJSON['type'] == 'essay') {
            newCardHTML = '<div class="card col-md-3 -gg-essay-card" z-default="1" z-hover="2">' +
                '<h5>' + documentPreviewJSON['title'] + '</h5>' +
                '<p class="small">' + documentPreviewJSON['preview'] + '</p>' +
                '<span>' + momentDate + '</span>' +
            '</div>';
        }

        var newCardObject = $.parseHTML(newCardHTML)[0];
        $(newCardObject).attr('id', documentPreviewJSON['id']);
        documentPreviewObjects.push(newCardObject);
    }

    return documentPreviewObjects;
}

function showEditor(e) {
    $('.-gg-tiles').hide();

    var cardId = e.target.id;

    if (cardId == "")
        cardId = e.target.parentNode.id;

    var cardJSON = cardsJSON[cardId];
    quill.setText(cardJSON['body']);

    var tagNameLabelsObjects = buildDocumentTagsObjects(cardId);

    // Set the back button ID to correspond with card ID for saving
    $('.-gg-editor-back-button').attr('id', '-gg-editor-back-button-' + cardId);
    $('.-gg-editor-add-tag-input').attr('id', '-gg-editor-add-tag-input-' + cardId);
    $('.-gg-editor-title').val(cardJSON['title']);
    $('.-gg-editor-tags').empty();
    $('.-gg-editor-tags').append(tagNameLabelsObjects);
    $('.-gg-editor-container').show();
}

function buildDocumentTagsObjects(cardId) {
    var tagNameLabelsObjects = [];
    for (var i = 0; i < cardsJSON[cardId]['tags'].length; i++) {
        var tagName = cardsJSON[cardId]['tags'][i]['name'];
        var tagId = cardsJSON[cardId]['tags'][i]['id'];
        var editorTagHTML = '<span id="-gg-editor-tag-' + tagId + '" class="-gg-editor-tag label label-primary">' + tagName + '</span>';
        var editorTagObject = $.parseHTML(editorTagHTML)[0];

        // When user clicks on a tag, delete it
        $(editorTagObject).click(function(e) {
            var tid = e.target.id.split('-')[4];
            console.log("TID: " + tid);
            // Delete the tag from this document
            var filteredTags = cardsJSON[cardId].tags.filter(function (t) {
                return t.id != tid
            });

            cardsJSON[cardId].tags = filteredTags;

            // Remove preview of JUST this card for the tag selected
            // delete documentPreviewsForTagIdJSON[tid];
            var filteredDocumentPreviews = documentPreviewsForTagIdJSON[tid].filter(function (doc) {
                return doc.id != cardId;
            });

            documentPreviewsForTagIdJSON[tid] = filteredDocumentPreviews;
            var numberOfDocumentsUsingThisTag = 0;
            if (documentPreviewsForTagIdJSON[tid]) {
                numberOfDocumentsUsingThisTag = documentPreviewsForTagIdJSON[tid].length;
            }

            console.log(">>> " + numberOfDocumentsUsingThisTag);

            // If this is the only occurance of this tag, delete it from the global tag list
            if (numberOfDocumentsUsingThisTag == 0) {
                tagsJSON = tagsJSON.filter(function (t) {
                    return t.id != tid;
                });

                console.log(tagsJSON);
                renderTags();
            }

        });

        tagNameLabelsObjects.push(editorTagObject);

    }
    return tagNameLabelsObjects;
}

function showTiles(e) {
    $('.-gg-editor-container').hide();
    $('.-gg-tiles').show();
}

function newNote(tagId) {
    var activeTagId = $('#-gg-tags-list li.active').attr('id');
    var newNoteId = $('.-gg-note-card').length + 1;

    var activeTagName = '';

    // create new blank note in JSON
    var newNotePreviewJSON = {
        'id': newNoteId,
        'title': 'New Note',
        'preview': 'Click here to start writing',
        'type': 'note',
        'date': moment()
    };

    documentPreviewsForTagIdJSON[activeTagId].push(newNotePreviewJSON);

    var newNoteJSON = {
        'title': 'New Note',
        'body': '',
        'type': 'note',
        'tags': [{
            'id': activeTagId,
            'name': getTagNameFromId(activeTagId)
        }],
        'date': newNotePreviewJSON['date']
    }

    cardsJSON[newNoteId]= newNoteJSON;
    showDocumentsForTag(activeTagId);
}

function newEssay(tagId) {
    // var activeTagId = $('#-gg-tags-list li.active').attr('id');
    // var newNoteId = $('.-gg-note-card').length + 1;
    //
    // // create new blank note in JSON
    // documentPrewviewJSON[activeTagId].push({
    //     'id': newNoteId,
    //     'title': 'New Essay',
    //     'preview': 'Click here to start writing',
    //     'type': 'essay',
    //     'date': moment()
    // });
    //
    // showDocumentsForTag(activeTagId);
}

function checkIfTagExists(newTagText) {
    // Check to make sure this tag isn't a duplicate
    for (var i = 0; i < tagsJSON.length; i++) {
        var tag = tagsJSON[i];

        if (tag['name'] == newTagText) {
            return tag['id'];
        }
    }

    return '';
}

function documentIsAlreadyTagged(cardId, newTagText) {
    // Disallow document to be tagged with the same tag more than once
    for (var i = 0; i < cardsJSON[cardId]['tags'].length; i++) {
        var tag = cardsJSON[cardId]['tags'][i];

        // Document already tagged
        if (tag['name'] == newTagText) {
            return true;
        }
    }

    return false;
}

function getTagNameFromId(tagId) {
    for (var i = 0; i < tagsJSON.length; i++) {
        var tag = tagsJSON[i];
        if (tag['id'] == tagId) {
            return tag['name'];
        }
    }

    return '';
}

function getDocumentPreviewIndexForDocumentId(tagId, documentId) {
    if (!documentPreviewsForTagIdJSON[tagId]) {
        return -1;
    }

    for (var i = 0; i < documentPreviewsForTagIdJSON[tagId].length; i++) {
        var dpJSON = documentPreviewsForTagIdJSON[tagId][i];
        if (dpJSON['id'] == documentId) {
            return i;
        }
    }

    return -1;
}

function getDocumentBodyPreview(body) {
    return body.substring(0, 12);
}

// MY CUSTOM CODE
$(document).ready(function() {

    quill = new Quill('.-gg-editor', {
        theme: 'bubble'
    });

    $('.-gg-editor-container').hide();

    // User clicks new tag button
    $('#-gg-new-tag-button').click(function() {

        var tagCount = tagsJSON.length;

        // Add new tag to data structure (TODO: create a better unique ID)
        tagsJSON.push({
            "id": "-gg-tag-" + tagCount,
            "name": ""
        });

        renderTags();
    });

    // Document filter controls
    // All documents
    $('#-gg-all-button').click(function() {
        $('.-gg-section-group li').removeClass('active');
        $('#-gg-all-button').addClass('active');

        $('.-gg-note-card').show();
        $('.-gg-essay-card').show();
    });

    // Notes
    $('#-gg-notes-button').click(function() {
        $('.-gg-section-group li').removeClass('active');
        $('#-gg-notes-button').addClass('active');

        $('.-gg-essay-card').hide();
        $('.-gg-note-card').show();
    });

    // Essays
    $('#-gg-essays-button').click(function() {
        $('.-gg-section-group li').removeClass('active');
        $('#-gg-essays-button').addClass('active');

        $('.-gg-note-card').hide();
        $('.-gg-essay-card').show();
    });

    // User creates new document
    $('.-gg-new-note-button').click(function(e) {
        newNote(null);
    });

    $('.-gg-editor-back-button').click(function(e) {
        // Save quill data
        var bbId = e.target.id.split('-');
        var cardId = bbId[5];
        cardsJSON[cardId]['body'] = quill.getText();
        cardsJSON[cardId]['title'] = $('.-gg-editor-title').val();
        // Tag data already saved - handled in event handler

        var activeTagId = $('#-gg-tags-list li.active').attr('id');

        var newPreviewIndex = getDocumentPreviewIndexForDocumentId(activeTagId, cardId);
        if (newPreviewIndex != -1) {
            documentPreviewsForTagIdJSON[activeTagId][newPreviewIndex]['title'] = cardsJSON[cardId]['title'];
            documentPreviewsForTagIdJSON[activeTagId][newPreviewIndex]['preview'] = getDocumentBodyPreview(cardsJSON[cardId]['body']);
        }

        showDocumentsForTag(activeTagId);
        showTiles();
    });

    // Add new tag to document
    $('.-gg-editor-add-tag-input').keypress(function(e) {
        if (e.which == 13) {
            console.log('enter');
            var cardId = $('.-gg-editor-add-tag-input').attr('id').split('-')[6];
            var tagCount = tagsJSON.length;

            var newTagText = $('.-gg-editor-add-tag-input').val().trim();
            var newTagHTMLId = 'ggtagidhtml_' + tagCount;

            // Check if document already has this tag
            if (documentIsAlreadyTagged(cardId, newTagText)) {
                return;
            }

            var newTag = { 'id': newTagHTMLId, 'name': newTagText };

            // Check if user is tagging document with non-existant tag
            var tempId = checkIfTagExists(newTagText);
            if (tempId != '') {
                // Tag exists, make sure to update the ID to the original tag ID
                newTag['id'] = tempId;
            } else {
                // Tag doesn't exist, so add it to the user's collection
                tagsJSON.push(newTag);

                // Update the tag collection UI
                renderTag(newTag);

                // TODO - this is where I'll create a new branch
            }

            // TODO - checkin the document to the appropriate branch

            // Update this document with the new tag
            cardsJSON[cardId]['tags'].push(newTag);

            // Update document previews
            var tagNameLabelsObjects = buildDocumentTagsObjects(cardId);
            $('.-gg-editor-tags').empty();
            $('.-gg-editor-tags').append(tagNameLabelsObjects);

            console.log('NEW TAG ID: ' + newTag['id']);
            var newDocumentPreviewForTagJSON = [{
                'id': cardId,
                'title': cardsJSON[cardId]['title'],
                'preview': getDocumentBodyPreview(cardsJSON[cardId]['title']),
                'type': cardsJSON[cardId]['type'],
                'date': moment()
            }];

            // If the tag is brand new
            if (!documentPreviewsForTagIdJSON[newTag['id']]) {
                console.log("foo");
                documentPreviewsForTagIdJSON[newTag['id']] = newDocumentPreviewForTagJSON;
            } else {
                console.log('bar');
                documentPreviewsForTagIdJSON[newTag['id']].push(newDocumentPreviewForTagJSON);
            }

            // Clear new tag input
            $('.-gg-editor-add-tag-input').val("");
        }
    });

    // Initial render
    renderTags();
    $('#-gg-tags-list li:first').addClass('active');
    var activeTagId = $('#-gg-tags-list li.active').attr('id');
    showDocumentsForTag(activeTagId);

});

// Events for dynamically generated elements
$(document).on('click', '.card', function (e) {
    showEditor(e);
})
