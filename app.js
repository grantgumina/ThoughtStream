// Register modal component
Vue.component('modal', {
    template: '#modal-template',
});

Vue.component('note-modal', {
    template: '#note-modal',

    data: function () {
        return {
            newTag: { id: '', name: '' },
        }
    },

    computed: {
        sanitizedNewTag: function() {
            return { 'id': this.newTag.id, 'name': this.newTag.name.trim() };
        }
    },

    props: ['doc'],

    methods: {

        close: function () {

            console.log('DOC:');
            console.log(this.doc);

            this.$emit('close');
            this.newTag = { id: '', name: '' };
            this.showNoteModal = false;

            main.selectedDoc = {};
        },

        addDocument: function() {
            console.log(this.title);
            console.log(this.body);

            // Check for title
            if (this.doc.title == '' || !this.doc.title) {
                alert('Notes must have a title');
                return;
            }

            // Check for content
            if (this.doc.body == '' || !this.doc.body) {
                alert('Notes must have content');
                return;
            }

            // Check for tags
            if (!this.doc.tags || this.doc.tags.length == 0) {
                alert('Notes must be tagged');
                return;
            }

            // Add to document library
            main.allDocuments.push({
                'id': main.generateGuid(), // Generate new tag ID
                'title': this.doc.title,
                'body': this.doc.body,
                'type': 'note',
                'tags': this.doc.tags,
                'date': Date.now()
            });

            this.close();
        },

        addTag: function() {
            var tag = {};

            // Check if tag is null/blank
            if (!this.newTag || this.sanitizedNewTag.name == "") {
                console.log("Blank tags not allowed");
                this.newTag = { id: '', name: '' };
                return;
            }

            // Check to make sure tag is just one word
            if (this.sanitizedNewTag.name.indexOf(" ") != -1) {
                console.log("Tags must be one word");
                this.newTag = { id: '', name: '' };
                return;
            }

            // Check if document is already tagged with this tag
            if (this.doc) {
                for (var i = 0; i < this.doc.tags.length; i++) {
                    tag = this.doc.tags[i];

                    if (tag.name.toLowerCase() == this.sanitizedNewTag.name.toLowerCase()) {
                        console.log('Document is already tagged');
                        this.newTag = { id: '', name: '' };
                        return;
                    }
                }
            }

            // Search if tag already exists
            for (var i = 0; i < main.allTags.length; i++) {
                var t = main.allTags[i];

                // Tag already exists
                if (t.name.toLowerCase() == this.sanitizedNewTag.name.toLowerCase()) {
                    console.log('Tag already exists');
                    this.newTag = t;

                    // Add new tag to this document
                    this.doc.tags.push(this.sanitizedNewTag);

                    // Clear input
                    this.newTag = { id: '', name: '' };
                    return;
                }
            }

            // If we're here, then this is a brand new tag
            this.doc.tags.push(this.sanitizedNewTag);
            main.allTags.push(this.sanitizedNewTag);

            // Clear input
            this.newTag = { id: '', name: '' };
        }
    },

    ready: function () {
        console.log('Modal ready');
    }
});

var main = new Vue({

    // We want to target the div with an id of 'events'
    el: '#thoughstream',

    // Here we can register any values or collections that hold data
    // for the application
    data: {
        // Flag for showing new document modal window
        showNoteModal: false,
        showNewEssayModal: false,

        // Tag Model
        tag: { id: '', name: '' },
        allTags: [],

        // Document Model
        doc: { title: '', body: '', type: '', tags: [], date: '' },

        // Populating documents with test/dummy data
        allDocuments: [
            {
                'title': 'JBP - MM1',
                'body': 'Hello world!',
                'type': 'note',
                'tags': [
                    { 'id': 'rexxxkd0', 'name': 'culture' },
                    { 'id': 'sfg00sad', 'name': 'history' }
                ],
                'date': 'Fri May 04 2015 01:17:07 GMT-0700 (PDT)'
            },
            {
                'id': '199437adx',
                'title': 'My Heritage',
                'body': 'FOOBAR NOOBAR!',
                'type': 'essay',
                'tags': [
                    { 'id': 'rexxxkd0', 'name': 'culture' },
                    { 'id': 'x3bxadf2', 'name': 'music' }
                ],
                'date': 'Th July 14 2016 05:17:07 GMT-0700 (PDT)'
            }
        ],

        // Selected document
        selectedDoc: {},

        selectedTag: {},

    },

    computed: {
        visibleDocuments: function() {
            var visibleDocs = [];
            for (var i = 0; i < this.allDocuments.length; i++) {
                var doc = this.allDocuments[i];
                var docTags = doc.tags;

                // Only show documents which have the selected tag
                for (var j = 0; j < docTags.length; j++) {
                    var dt = docTags[j];
                    // If document has selected tag show it
                    if (dt.id == this.selectedTag.id) {
                        visibleDocs.push(doc);
                    }
                }
            }
            return visibleDocs;
        }
    },

    // Anything within the ready function will run when the application loads
    mounted: function() {
        // When the application loads, we want to call the method that initializes
        // some data
        console.log("FETCHING TAGS");
        this.fetchTags();
        console.log("FETCHING DOCUMENT FOR TAGS");
        this.fetchDocumentsForTag();

        if (this.allTags.length > 0) {
            this.selectedTag = this.allTags[0];
        }
    },

    // Methods we want to use in our application are registered here
    methods: {
        // Get all tags belonging to the user
        fetchTags: function() {
            var tags = [
                {
                    "id": "rexxxkd0",
                    "name": "culture"
                },
                {
                    "id": "sfg00sad",
                    "name": "history"
                },
                {
                    "id": "x3bxadf2",
                    "name": "music"
                }
            ];

            this.allTags = tags;
        },

        // Get all of the user's documents for a specific tag
        fetchDocumentsForTag: function(tagId) {

        },

        // Show document user clicked on
        showDocument: function(doc) {
            console.log("User clicked on document");
            console.log(doc.title);

            this.selectedDoc = doc;
            this.showNoteModal = true;
        },

        showDocumentsByTag: function(tag) {
            this.selectedTag = tag;
        },

        // Document Filters
        showAll: function(e) {

        },

        showNotes: function(e) {

        },

        showEssays: function(e) {

        },

        openNewNoteModal: function() {
            this.selectedDoc = {
                'id': '',
                'title': '',
                'body': '',
                'type': '',
                'tags': [],
                'date': '',
                'isNewDocument': true,
            }
            // Add selected tag to document
            this.selectedDoc.tags.push(this.selectedTag);
            this.showNoteModal = true;
        },

        openNewTagModal: function() {
            console.log(this.allDocuments);
        },

        isTagActive: function(tag) {
            var result = [];
            if (tag == this.selectedTag) {
                result.push('active');
            }

            return result;
        },

        // Helper functions
        getDocumentPreviewText: function(documentBody) {
            return documentBody.substring(0, 12);
        },

        generateGuid: function() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        },
    }
});
