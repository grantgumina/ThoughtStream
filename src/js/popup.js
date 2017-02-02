window.onload = function () {

    var vm = new Vue({
        el: '#application',

        data: {
        },

        computed: {
        },

        methods: {

            getCurrentTabUrl: function(callback) {
                var queryInfo = {
                    active: true,
                    currentWindow: true
                };

                chrome.tabs.query(queryInfo, function(tabs) {
                    var tab = tabs[0];
                    var url = tab.url;
                    callback(url);
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
