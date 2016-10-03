// register modal component
Vue.component('modal', {
    template: '#modal-template',
    props: ['show'],
    methods: {
        close: function () {
            this.show = false;
            // this.showModal = false;
        },
        savePost: function () {
            // Insert AJAX call here...
            this.close();
        }
    },
    ready: function () {
        document.addEventListener("keydown", (e) => {
            if (this.show && e.keyCode == 27) {
                this.close();
            }
        });
    }
});

new Vue({

    // We want to target the div with an id of 'events'
    el: '#thoughstream',

    // Here we can register any values or collections that hold data
    // for the application
    data: {
        // Flag for showing new document modal window
        showModal: false,

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
    },

    // Anything within the ready function will run when the application loads
    mounted: function() {
        // When the application loads, we want to call the method that initializes
        // some data
        console.log("FETCHING TAGS");
        this.fetchTags();
        console.log("FETCHING DOCUMENT FOR TAGS");
        this.fetchDocumentsForTag();
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

        // Adds an event to the existing events array
        // addEvent: function() {
        //     if (this.event.name) {
        //         this.events.push(this.event);
        //         this.event = { name: '', description: '', date: '' };
        //     }
        // },
        //
        // deleteEvent: function(e) {
        //     console.log(e);
        //     if (confirm("Are you sure you want to delete this event?")) {
        //         this.events.splice(e, 1);
        //     }
        // },

        // New Document
        addDocument: function() {
            console.log("ADD DOCUMENT");
            console.log("showModal: " + this.showModal);
            // this.allDocuments.push({
            //     'title': 'JBP - MM2',
            //     'body': '2 - Hello world!',
            //     'type': 'note',
            //     'tags': [
            //         { 'id': 'rexxxkd0', 'name': 'culture' },
            //         { 'id': 'sfg00sad', 'name': 'history' }
            //     ],
            //     'date': 'Fri May 04 2016 01:17:07 GMT-0700 (PDT)'
            // });

            // $emit('close');
        },

        // Document Filters
        showAll: function(e) {

        },

        showNotes: function(e) {

        },

        showEssays: function(e) {

        },

        // Helper functions
        getDocumentPreviewText: function(documentBody) {
            return documentBody.substring(0, 12);
        },
    }
});
