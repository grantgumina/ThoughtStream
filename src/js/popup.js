window.onload = function () {

    var vm = new Vue({
        el: '#application',

        data: {
            streams: [{name: "culture", documents: [0, 1, 2]}, {name: "music", documents: [0, 1, 2, 3, 4]}],
            searchValue: "",
        },

        computed: {
            filteredStreams: function() {
                var names = this.streams.map(function(s) { return s.name });
                var filteredResults = fuzzy.filter(this.searchValue, names, null);
                var filteredNames = filteredResults.map(function(el) { return el.string });

                var fs = this.streams.filter(function(s) {
                    if (filteredNames.includes(s.name)) {
                        return s;
                    }

                    return null;
                });

                return fs;
            }
        },

        methods: {

            createNewStream: function() {
                var names = this.streams.map(function(s) { return s.name });

                if (!names.includes(this.searchValue)) {
                    var newStream = {
                        name: this.searchValue,
                        documents: []
                    };

                    this.streams.push(newStream);
                }
            },

            addDocumentToStream: function(streamName) {
                console.log(streamName);

                // Get tab URL
                var queryInfo = {
                    active: true,
                    currentWindow: true
                };

                chrome.tabs.query(queryInfo, function(tabs) {
                    var tab = tabs[0];
                    var url = tab.url;
                    
                });
            },

            openUrl: function(href) {
                chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                    var tab = tabs[0];
                    chrome.tabs.create({ url: href });
                });
            },

            loadData: function() {
            },
        }
    });

    vm.loadData();
}
