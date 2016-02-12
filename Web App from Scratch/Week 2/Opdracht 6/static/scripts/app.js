var myApp = myApp || {};

//Thanks to Matthias Dolstra and Senny Kalidien for helping and working with me on this project

//IIFE, this is a self invoking function
(function () {
    'use strict';

    //Object literal declarations
    myApp.app = {
        //init is a method
        init: function () {
            myApp.api.init();
        }
    };

    myApp.api = {
        init: function () {
            aja()
                .url('http://api.nytimes.com/svc/books/v2/lists/e-book-fiction.json?&api-key=b147374c9f7b0f2b25ddf9694dc28511:4:74324460')
                .on('success', function (data) {
                    var newdata = _.map(data.results, function (data, iteratee) {
                        data.book_details[0].id = _.uniqueId('article_');

                        return data;
                    });

                    newdata.forEach(function (current, index) {
                        //                        console.log(index)
                        //                        console.log(current.book_details)
                    })
                    myApp.routes.init(data);

                })
                .go();
        }
    }

    myApp.routes = {
        init: function (data) {
            routie({
                'home': function () {
                    myApp.routes.toggle(window.location.hash);
                },
                'bestsellers': function () {
                    myApp.routes.toggle(window.location.hash);
                    myApp.page.bestSeller.init(data);
                },
                'bestsellersdetail/:id': function (id) {
                    myApp.routes.toggle(window.location.hash.slice(0, 18));
                    myApp.page.bestsellerDetail.init(data, id);
                    //                    myApp.page.bestsellerDetail.init();
                },
                '*': function () {
                    myApp.routes.toggle(window.location.hash);
                }
            });
        },
        toggle: function (route) {
            var sections = document.querySelectorAll('.togglesection'); // Watch the single & double quote's
            var i;

            for (i = 0; i < sections.length; i++) {
                sections[i].classList.add('inactive');

                //If there is no hash, make every section visible, in case JS is disabled.
                if (!route) {
                    sections[0].classList.remove('inactive');
                } else {

                    //make the right section, according to its hash, visible
                    document.querySelector(route).classList.remove('inactive');
                }
            }
        }
    };

    myApp.page = {
        bestSeller: {
            init: function (data) {
                var directives = {
                    results: {
                        book_details: {
                            book_image: {
                                src: function () {
                                    return this.book_image
                                }
                            },
                            author: {
                                text: function () {
                                    return 'This book is written by ' + this.author;
                                }
                            },
                            id: {
                                text: function () {
                                    return this.title;
                                },
                                href: function () {
                                    return '#bestsellersdetail/' + this.id;
                                    console.log(data.results[0].book_details[0])
                                }
                            }
                        },
                    }
                };
                Transparency.render(document.querySelector('[data-route="bestsellers"]'), data, directives);
            }
        },
        bestsellerDetail: {
            init: function (data, id) {
                data.results.forEach(function (currentValue, index) {
                    //                    console.log(currentValue.book_details[0].id)
                    if (currentValue.book_details[0].id === id) {
                        console.log(currentValue)

                        var directives = {
                            results: {
                                book_details: {
                                    description: {
                                        src: function () {
                                            return this.description
                                        }
                                    },
                                    title: {
                                        text: function() {
                                            return this.title
                                        }
                                    }
                                }
                            }
                        };
                        Transparency.render(document.querySelector('[data-route="bestsellersdetail"]'), currentValue, directives);
                    }
                })

            }
        }
    }

    //Initialize app to run the application
    myApp.app.init();
}());