(function () {
    "use strict";

    window.StudioAuth = {
        getCookie: function (name) {
            var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
            return match ? match[2] : null;
        },

        fetchWithAuth: function (url, options) {
            options = options || {};
            options.credentials = "same-origin";
            return fetch(url, options).then(function (resp) {
                if (resp.status === 401) {
                    window.location.href = "/static/login.html";
                    return Promise.reject(new Error("Not authenticated"));
                }
                return resp;
            });
        },

        checkAuth: function () {
            return this.fetchWithAuth("/api/auth/me")
                .then(function (resp) { return resp.json(); })
                .then(function (data) { return data.user || null; })
                .catch(function () { return null; });
        },

        requireAuth: function () {
            return this.checkAuth().then(function (user) {
                if (!user) {
                    window.location.href = "/static/login.html";
                    return Promise.reject(new Error("Redirecting to login"));
                }
                return user;
            });
        },

        logout: function () {
            return this.fetchWithAuth("/api/auth/logout", { method: "POST" })
                .then(function () {
                    window.location.href = "/static/login.html";
                });
        },
    };
})();
