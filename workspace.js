/* global cpdefine chilipeppr cprequire */
cprequire_test(["inline:nl-elzekool-workspace-grbl"], function(ws) {

    console.log("initting workspace");

    /**
     * The Root workspace (when you see the ChiliPeppr Header) auto Loads the Flash 
     * Widget so we can show the 3 second flash messages. However, in test mode we
     * like to see them as well, so just load it from the cprequire_test() method
     * so we have similar functionality when testing this workspace.
     */
    var loadFlashMsg = function() {
        chilipeppr.load("#com-chilipeppr-widget-flash-instance",
            "http://fiddle.jshell.net/chilipeppr/90698kax/show/light/",
            function() {
                console.log("mycallback got called after loading flash msg module");
                cprequire(["inline:com-chilipeppr-elem-flashmsg"], function(fm) {
                    //console.log("inside require of " + fm.id);
                    fm.init();
                });
            }
        );
    };
    loadFlashMsg();

    // Init workspace
    ws.init();

    // Do some niceties for testing like margins on widget and title for browser
    $('title').html("grbl Workspace");
    $('body').css('padding', '10px');

} /*end_test*/ );

// This is the main definition of your widget. Give it a unique name.
cpdefine("inline:nl-elzekool-workspace-grbl", ["chilipeppr_ready"], function() {
    return {
        /**
         * The ID of the widget. You must define this and make it unique.
         */
        id: "nl-elzekool-grbl", // Make the id the same as the cpdefine id
        name: "Workspace / grbl-elze", // The descriptive name of your widget.
        desc: `A ChiliPeppr Workspace grbl.`,
        url: "(auto fill by runme.js)", // The final URL of the working widget as a single HTML file with CSS and Javascript inlined. You can let runme.js auto fill this if you are using Cloud9.
        fiddleurl: "(auto fill by runme.js)", // The edit URL. This can be auto-filled by runme.js in Cloud9 if you'd like, or just define it on your own to help people know where they can edit/fork your widget
        githuburl: "(auto fill by runme.js)", // The backing github repo
        testurl: "(auto fill by runme.js)", // The standalone working widget so can view it working by itself
        /**
         * Contains reference to the Console widget object. Hang onto the reference
         * so we can resize it when the window resizes because we want it to manually
         * resize to fill the height of the browser so it looks clean.
         */
        widgetConsole: null,
        /**
         * Contains reference to the Serial Port JSON Server object.
         */
        //widgetSpjs: null,
        /**
         * The workspace's init method. It loads the all the widgets contained in the workspace
         * and inits them.
         */
        init: function() {
            this.loadWidgets();
            this.loadWorkspaceMenu();
            this.addBillboardToWorkspaceMenu();
            this.setupResize();
            setTimeout(function() {
                $(window).trigger('resize');
            }, 100);

        },
        /**
         * Returns the billboard HTML, CSS, and Javascript for this Workspace. The billboard
         * is used by the home page, the workspace picker, and the fork pulldown to show a
         * consistent name/image/description tag for the workspace throughout the ChiliPeppr ecosystem.
         */
        getBillboard: function() {
            var el = $('#' + this.id + '-billboard').clone();
            el.removeClass("hidden");
            el.find('.billboard-desc').text(this.desc);
            return el;
        },
        /**
         * Inject the billboard into the Workspace upper right corner pulldown which
         * follows the standard template for workspace pulldown menus.
         */
        addBillboardToWorkspaceMenu: function() {
            // get copy of billboard
            var billboardEl = this.getBillboard();
            $('#' + this.id + ' .com-chilipeppr-ws-billboard').append(billboardEl);
        },
        /**
         * Listen to window resize event.
         */
        setupResize: function() {
            $(window).on('resize', this.onResize.bind(this));
        },
        /**
         * When browser window resizes, forcibly resize the Console window
         */
        onResize: function() {
            if (this.widgetConsole) this.widgetConsole.resize();
        },
        /**
         * Load the Template widget via chilipeppr.load() so folks have a sample
         * widget they can fork as a starting point for their own.
         */
        loadTemplateWidget: function(callback) {

            chilipeppr.load(
                "#com-chilipeppr-widget-template-instance",
                "http://raw.githubusercontent.com/chilipeppr/widget-template/master/auto-generated-widget.html",
                function() {
                    // Callback after widget loaded into #myDivWidgetTemplate
                    // Now use require.js to get reference to instantiated widget
                    cprequire(
                        ["inline:com-chilipeppr-widget-template"], // the id you gave your widget
                        function(myObjWidgetTemplate) {
                            // Callback that is passed reference to the newly loaded widget
                            console.log("Widget / Template just got loaded.", myObjWidgetTemplate);
                            myObjWidgetTemplate.init();
                        }
                    );
                }
            );
        },
        /**
         * Load the Serial Port JSON Server widget via chilipeppr.load()
         */
        loadSpjsWidget: function(callback) {

            var that = this;

            chilipeppr.load(
                "#com-chilipeppr-widget-serialport-instance",
                "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
                function() {
                    console.log("mycallback got called after loading spjs module");
                    cprequire(["inline:com-chilipeppr-widget-serialport"], function(spjs) {
                        //console.log("inside require of " + fm.id);
                        spjs.setSingleSelectMode();
                        spjs.init({
                            isSingleSelectMode: true,
                            defaultBuffer: "default",
                            defaultBaud: 115200,
                            bufferEncouragementMsg: 'For your device please choose the "default" buffer in the pulldown and a 115200 baud rate before connecting.'
                        });
                        //spjs.showBody();
                        //spjs.consoleToggle();

                        that.widgetSpjs - spjs;

                        if (callback) callback(spjs);

                    });
                }
            );
        },
        /**
         * Load the Console widget via chilipeppr.load()
         */
        loadConsoleWidget: function(callback) {
            var that = this;
            chilipeppr.load(
                "#com-chilipeppr-widget-spconsole-instance",
                "http://fiddle.jshell.net/chilipeppr/rczajbx0/show/light/",
                function() {
                    // Callback after widget loaded into #com-chilipeppr-widget-spconsole-instance
                    cprequire(
                        ["inline:com-chilipeppr-widget-spconsole"], // the id you gave your widget
                        function(mywidget) {
                            // Callback that is passed reference to your newly loaded widget
                            console.log("My Console widget just got loaded.", mywidget);
                            that.widgetConsole = mywidget;

                            // init the serial port console
                            // 1st param tells the console to use "single port mode" which
                            // means it will only show data for the green selected serial port
                            // rather than for multiple serial ports
                            // 2nd param is a regexp filter where the console will filter out
                            // annoying messages you don't generally want to see back from your
                            // device, but that the user can toggle on/off with the funnel icon
                            that.widgetConsole.init(true, /myfilter/);
                            if (callback) callback(mywidget);
                        }
                    );
                }
            );
        },
        /**
         * Load the workspace menu and show the pubsubviewer and fork links using
         * our pubsubviewer widget that makes those links for us.
         */
        loadWorkspaceMenu: function(callback) {
            // Workspace Menu with Workspace Billboard
            var that = this;
            chilipeppr.load(
                "http://fiddle.jshell.net/chilipeppr/zMbL9/show/light/",
                function() {
                    require(['inline:com-chilipeppr-elem-pubsubviewer'], function(pubsubviewer) {

                        var el = $('#' + that.id + ' .com-chilipeppr-ws-menu .dropdown-menu-ws');
                        console.log("got callback for attachto menu for workspace. attaching to el:", el);

                        pubsubviewer.attachTo(
                            el,
                            that,
                            "Workspace"
                        );

                        if (callback) callback();
                    });
                }
            );
        },


        loadWidgets: function(callback) {

            // Load top bar elements

            // Auto-Leveller
            // com-chilipeppr-ws-autolevel
            // hiding auto leveller as unsure what features supported in grbl. will come back to this.
            // http:jsfiddle.net/jarret/uvVL6/
            
            chilipeppr.load(
                "#com-chilipeppr-ws-autolevel",
                "http://raw.githubusercontent.com/chilipeppr-grbl/grbl-widget-autolevel/master/auto-generated-widget.html",
                function() {
                    require(["inline:com-chilipeppr-widget-autolevel"], function(autolevel) {
                        autolevel.init();
                        // setup toggle button
                        var alBtn = $('#com-chilipeppr-ws-gcode-menu .autolevel-button');
                        var alDiv = $('#com-chilipeppr-ws-autolevel');
                        alBtn.click(function() {
                            if (alDiv.hasClass("hidden")) {
                                // unhide
                                alDiv.removeClass("hidden");
                                alBtn.addClass("active");
                                autolevel.onDisplay();
                            }
                            else {
                                alDiv.addClass("hidden");
                                alBtn.removeClass("active");
                                autolevel.onUndisplay();
                            }
                            $(window).trigger('resize');

                        });
                    });
                });

            // JScut
            // com-chilipeppr-ws-jscut
            chilipeppr.load(
                "#com-chilipeppr-ws-jscut",
                "http://fiddle.jshell.net/chilipeppr/7ZzSV/show/light/",
                function() {
                    require(["inline:org-jscut-gcode-widget"], function(jscut) {
                        jscut.init();
                        // setup toggle button
                        var alBtn = $('#com-chilipeppr-ws-gcode-menu .jscut-button');
                        var alDiv = $('#com-chilipeppr-ws-jscut');
                        alBtn.click(function() {
                            if (alDiv.hasClass("hidden")) {
                                // unhide
                                alDiv.removeClass("hidden");
                                alBtn.addClass("active");
                            }
                            else {
                                alDiv.addClass("hidden");
                                alBtn.removeClass("active");
                            }
                            $(window).trigger('resize');

                        });
                    });
                });

            // Element / Drag Drop
            // Load the dragdrop element into workspace toolbar
            // http://jsfiddle.net/chilipeppr/Z9F6G/
            chilipeppr.load("#com-chilipeppr-ws-gcode-dragdrop",
                "http://fiddle.jshell.net/chilipeppr/Z9F6G/show/light/",
                function() {
                    require(["inline:com-chilipeppr-elem-dragdrop"], function(dd) {
                        console.log("inside require of dragdrop");
                        $('.com-chilipeppr-elem-dragdrop').removeClass('well');
                        dd.init();
                        // The Chilipeppr drag drop element will publish
                        // on channel /com-chilipeppr-elem-dragdrop/ondropped
                        // when a file is dropped so subscribe to it
                        // It also adds a hover class to the bound DOM elem
                        // so you can add CSS to hilite on hover
                        dd.bind("#com-chilipeppr-ws-gcode-wrapper", null);
                        //$(".com-chilipeppr-elem-dragdrop").popover('show');
                        //dd.bind("#pnlWorkspace", null);
                        var ddoverlay = $('#com-chilipeppr-ws-gcode-dragdropoverlay');
                        chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragover", function() {
                            //console.log("got dragdrop hover");
                            ddoverlay.removeClass("hidden");
                        });
                        chilipeppr.subscribe("/com-chilipeppr-elem-dragdrop/ondragleave", function() {
                            ddoverlay.addClass("hidden");
                            //console.log("got dragdrop leave");
                        });
                        console.log(dd);
                    });
                });

            // Workspace Menu with Workspace Billboard
            // http://jsfiddle.net/jlauer/yC8Hv/
            chilipeppr.load(
                "#com-chilipeppr-ws-gcode-menu-billboard",
                "http://fiddle.jshell.net/chilipeppr/6z76Z/show/light/");


            // 3D Viewer
            // http://jsfiddle.net/chilipeppr/y3HRF
            chilipeppr.load("#com-chilipeppr-3dviewer",
                //"http://fiddle.jshell.net/chilipeppr/y3HRF/show/light/",
                "http://raw.githubusercontent.com/chilipeppr/widget-3dviewer/master/auto-generated-widget.html",

                function() {
                    console.log("got callback done loading 3d");

                    cprequire(
                        ['inline:com-chilipeppr-widget-3dviewer'],

                        function(threed) {
                            //override gotoXyz function to take into account the units parameter passed back in axes pubsub from GRBL.
                            threed.gotoXyz = function(data) {
                                // we are sent this command by the CNC controller generic interface
                                console.log("gotoXyz. data:", data);
                                console.log("gotoXyz. curUnits:", threed.isUnitsMm);
                                threed.animNoSleep();
                                threed.tweenIsPlaying = false;
                                threed.tweenPaused = true;

                                var coords = {
                                    x: null,
                                    y: null,
                                    z: null
                                }; //create separate variable to see if that helps

                                //first, we may need to convert units to match 3d viewer
                                if (data.unit == "mm" && threed.isUnitsMm === false) {
                                    coords.x = (data.x / 25.4).toFixed(3);
                                    coords.y = (data.y / 25.4).toFixed(3);
                                    coords.z = (data.z / 25.4).toFixed(3);
                                }
                                else if (data.unit == "inch" && threed.isUnitsMm === true) {
                                    coords.x = (data.x * 25.4).toFixed(3);
                                    coords.y = (data.y * 25.4).toFixed(3);
                                    coords.z = (data.z * 25.4).toFixed(3);
                                }
                                else {
                                    coords.x = data.x;
                                    coords.y = data.y;
                                    coords.z = data.z;
                                }

                                console.log("gotoXyz. coords:", coords);

                                if ('x' in coords && coords.x !== null) threed.toolhead.position.x = coords.x;
                                if ('y' in coords && coords.y !== null) threed.toolhead.position.y = coords.y;
                                if ('z' in coords && coords.z !== null) threed.toolhead.position.z = coords.z;
                                if (threed.showShadow) {
                                    threed.toolhead.children[0].target.position.set(threed.toolhead.position.x, threed.toolhead.position.y, threed.toolhead.position.z);
                                    threed.toolhead.children[1].target.position.set(threed.toolhead.position.x, threed.toolhead.position.y, threed.toolhead.position.z);
                                }
                                threed.lookAtToolHead();

                                // see if jogging, if so rework the jog tool
                                // double check that our jog 3d object is defined
                                // cuz on early load we can get here prior to the
                                // jog cylinder and other objects being defined
                                if (threed.isJogSelect && threed.jogArrowCyl) {
                                    if ('z' in coords && coords.z !== null) {
                                        console.log("adjusting jog tool:", threed.jogArrow);
                                        var cyl = threed.jogArrowCyl; //.children[0];
                                        var line = threed.jogArrowLine; //.children[2];
                                        var shadow = threed.jogArrowShadow; //.children[3];
                                        var posZ = coords.z * 3; // acct for scale
                                        cyl.position.setZ(posZ + 20);
                                        console.log("line:", line.geometry.vertices);
                                        line.geometry.vertices[1].z = posZ; // 2nd top vertex
                                        line.geometry.verticesNeedUpdate = true;
                                        shadow.position.setX(posZ * -1); // make x be z offset
                                    }
                                }

                                threed.animAllowSleep();
                            };
                            //Pulled the entire GCodeParser logic in here to correct the problem with multiple GCODE commands on a single line
                            //Waiting for John to implement a "better" solution in the master 3dViewer fork.
                            threed.GCodeParser = function(handlers) {
                                this.handlers = handlers || {};

                                this.lastArgs = {
                                    cmd: null
                                };
                                this.lastFeedrate = null;
                                this.isUnitsMm = true;

                                this.parseLine = function(text, info) {
                                    //text = text.replace(/;.*$/, '').trim(); // Remove comments
                                    //text = text.replace(/\(.*$/, '').trim(); // Remove comments
                                    //text = text.replace(/<!--.*?-->/, '').trim(); // Remove comments

                                    var origtext = text;
                                    // remove line numbers if exist
                                    if (text.match(/^N/i)) {
                                        // yes, there's a line num
                                        text = text.replace(/^N\d+\s*/ig, "");
                                    }

                                    // collapse leading zero g cmds to no leading zero
                                    text = text.replace(/G00/i, 'G0');
                                    text = text.replace(/G0(\d)/i, 'G$1');
                                    // add spaces before g cmds and xyzabcijkf params
                                    text = text.replace(/([gmtxyzabcijkfst])/ig, " $1");
                                    // remove spaces after xyzabcijkf params because a number should be directly after them
                                    text = text.replace(/([xyzabcijkfst])\s+/ig, "$1");
                                    // remove front and trailing space
                                    text = text.trim();

                                    // see if comment
                                    var isComment = false;
                                    if (text.match(/^(;|\(|<)/)) {
                                        text = origtext;
                                        isComment = true;
                                    }
                                    else {
                                        // make sure to remove inline comments
                                        text = text.replace(/\(.*?\)/g, "");
                                    }
                                    //console.log("gcode txt:", text);

                                    if (text && !isComment) {
                                        //console.log("there is txt and it's not a comment");
                                        //console.log("");
                                        // preprocess XYZIJ params to make sure there's a space
                                        //text = text.replace(/(X|Y|Z|I|J|K)/ig, "$1 ");
                                        //console.log("gcode txt:", text);

                                        // strip off end of line comment
                                        text = text.replace(/(;|\().*$/, ""); // ; or () trailing
                                        //text = text.replace(/\(.*$/, ""); // () trailing

                                        var tokens = text.split(/\s+/);
                                        //console.log("tokens:", tokens);
                                        if (tokens) {
                                            var cmd = tokens[0];
                                            cmd = cmd.toUpperCase();
                                            // check if a g or m cmd was included in gcode line
                                            // you are allowed to just specify coords on a line
                                            // and it should be assumed that the last specified gcode
                                            // cmd is what's assumed
                                            isComment = false;
                                            if (!cmd.match(/^(G|M|T)/i)) {
                                                // if comment, drop it
                                                /*
                                                if (cmd.match(/(;|\(|<)/)) {
                                                    // is comment. do nothing.
                                                    isComment = true;
                                                    text = origtext;
                                                    //console.log("got comment:", cmd);
                                                } else {
                                                */

                                                //console.log("no cmd so using last one. lastArgs:", this.lastArgs);
                                                // we need to use the last gcode cmd
                                                cmd = this.lastArgs.cmd;
                                                //console.log("using last cmd:", cmd);
                                                tokens.unshift(cmd); // put at spot 0 in array
                                                //console.log("tokens:", tokens);
                                                //}
                                            }
                                            else {

                                                // we have a normal cmd as opposed to just an xyz pos where
                                                // it assumes you should use the last cmd
                                                // however, need to remove inline comments (TODO. it seems parser works fine for now)

                                            }
                                            var args = {
                                                'cmd': cmd,
                                                'text': text,
                                                'origtext': origtext,
                                                'indx': info,
                                                'isComment': isComment,
                                                'feedrate': null,
                                                'plane': undefined
                                            };

                                            //console.log("args:", args);
                                            if (tokens.length > 1 && !isComment) {
                                                tokens.splice(1).forEach(function(token) {
                                                    //console.log("token:", token);
                                                    if (token && token.length > 0) {
                                                        var key = token[0].toLowerCase();
                                                        var value = parseFloat(token.substring(1));
                                                        //console.log("value:", value, "key:", key);
                                                        //if (isNaN(value))
                                                        //    console.error("got NaN. val:", value, "key:", key, "tokens:", tokens);
                                                        args[key] = value;
                                                    }
                                                    else {
                                                        //console.log("couldn't parse token in foreach. weird:", token);
                                                    }
                                                });
                                            }
                                            var handler = this.handlers[cmd] || this.handlers['default'];

                                            // don't save if saw a comment
                                            if (!args.isComment) {
                                                this.lastArgs = args;
                                                //console.log("just saved lastArgs for next use:", this.lastArgs);
                                            }
                                            else {
                                                //console.log("this was a comment, so didn't save lastArgs");
                                            }
                                            //console.log("calling handler: cmd:", cmd, "args:", args, "info:", info);
                                            if (handler) {

                                                // do extra check here for units. units are
                                                // specified via G20 or G21. We need to scan
                                                // each line to see if it's inside the line because
                                                // we were only catching it when it was the first cmd
                                                // of the line.
                                                if (args.text.match(/\bG20\b/i)) {
                                                    console.log("SETTING UNITS TO INCHES from pre-parser!!!");
                                                    this.isUnitsMm = false; // false means inches cuz default is mm
                                                }
                                                else if (args.text.match(/\bG21\b/i)) {
                                                    console.log("SETTING UNITS TO MM!!! from pre-parser");
                                                    this.isUnitsMm = true; // true means mm
                                                }

                                                // scan for feedrate
                                                if (args.text.match(/F([\d.]+)/i)) {
                                                    // we have a new feedrate
                                                    var feedrate = parseFloat(RegExp.$1);
                                                    console.log("got feedrate on this line. feedrate:", feedrate, "args:", args);
                                                    args.feedrate = feedrate;
                                                    this.lastFeedrate = feedrate;
                                                }
                                                else {
                                                    // use feedrate from prior lines
                                                    args.feedrate = this.lastFeedrate;
                                                    //if (args.feedrate 
                                                }

                                                //console.log("about to call handler. args:", args, "info:", info, "this:", this);

                                                return handler(args, info, this);
                                            }
                                            else {
                                                console.error("No handler for gcode command!!!");
                                            }

                                        }
                                    }
                                    else {
                                        // it was a comment or the line was empty
                                        // we still need to create a segment with xyz in p2
                                        // so that when we're being asked to /gotoline we have a position
                                        // for each gcode line, even comments. we just use the last real position
                                        // to give each gcode line (even a blank line) a spot to go to
                                        var args = {
                                            'cmd': 'empty or comment',
                                            'text': text,
                                            'origtext': origtext,
                                            'indx': info,
                                            'isComment': isComment
                                        };
                                        var handler = this.handlers['default'];
                                        return handler(args, info, this);
                                    }
                                }

                                this.parse = function(gcode) {
                                    //remove N### values, find any 'G' gcode commands and add a \n in front, then clean up any double \n\n's that resulted
                                    gcode = gcode.replace(/(^|\n)N\d+\s*/ig, "\n").replace(/G/ig, "\nG").replace(/\n\n/ig, "\n");
                                    var lines = gcode.split(/\r{0,1}\n/);
                                    for (var i = 0; i < lines.length; i++) {
                                        if (this.parseLine(lines[i], i) === false) {
                                            break;
                                        }
                                    }
                                }
                            };

                            console.log("Running 3dviewer");
                            threed.init();
                            console.log("3d viewer initted");

                            // Ok, do someting whacky. Try to move the 3D Viewer 
                            // Control Panel to the center column
                            setTimeout(function() {
                                var element = $('#com-chilipeppr-3dviewer .panel-heading').detach();
                                $('#com-chilipeppr-3dviewer').addClass("noheight");
                                $('#com-chilipeppr-widget-3dviewer').addClass("nomargin");
                                $('#com-chilipeppr-3dviewer-controlpanel').append(element);
                            }, 10);

                            // listen to resize events so we can resize our 3d viewer
                            // this was done to solve the scrollbar residue we were seeing
                            // resize this console on a browser resize
                            var mytimeout = null;
                            $(window).on('resize', function(evt) {
                                //console.log("3d view force resize");
                                if (mytimeout !== undefined && mytimeout != null) {
                                    clearTimeout(mytimeout);
                                    //console.log("cancelling timeout resize");
                                }
                                mytimeout = setTimeout(function() {
                                    console.log("3d view force resize. 1 sec later");
                                    threed.resize();
                                }, 1000);

                            });

                            //disable the toolhead following by default
                            // turn off looking at toolhead
                            threed.isLookAtToolHeadMode = false;
                            $('.com-chilipeppr-widget-3d-menu-lookattoolhead').removeClass("active btn-primary");

                        });

                });


            // Gcode List
            // http://jsfiddle.net/chilipeppr/a4g5ds5n/
            chilipeppr.load("#com-chilipeppr-gcode-list",
                "http://fiddle.jshell.net/chilipeppr/a4g5ds5n/show/light/",
                //"http://jsfiddle.net/jarret/0a53jy0x/show/light",

                function() {
                    cprequire(
                        ["inline:com-chilipeppr-widget-gcode"],

                        function(gcodelist) {
                            gcodelist.init();
                        });
                });


            //Axes Widget XYZA
            //This widget is locked at version 97 until upgrades can be tested with the override code.
            chilipeppr.load(
                "com-chilipeppr-xyz",
                "http://fiddle.jshell.net/chilipeppr/gh45j/97/show/light/",

                function() {
                    cprequire(
                        ["inline:com-chilipeppr-widget-xyz"],

                        function(xyz) {
                            //overwrite the G28 homing process with grbl's $H homing
                            var oldHomeAxis = xyz.homeAxis.bind(xyz);
                            var newHomeAxis = function(data) {
                                var cmd = "$H\n";
                                console.log(cmd);
                                chilipeppr.publish("/com-chilipeppr-widget-serialport/send", cmd);

                            };
                            var oldSendDone = xyz.sendDone.bind(xyz);
                            var newSendDone = function(data) {

                            };
                            xyz.homeAxis = newHomeAxis;
                            xyz.sendDone = newSendDone;

                            xyz.updateAxesFromStatus = function(axes) {
                                console.log("updateAxesFromStatus:", axes);

                                var coords = {
                                        x: null,
                                        y: null,
                                        z: null
                                    } //create local object to edit

                                //first, we may need to convert units to match 3d viewer
                                if (axes.unit == "mm" && xyz.currentUnits === "inch") {
                                    coords.x = (axes.x / 25.4).toFixed(3);
                                    coords.y = (axes.y / 25.4).toFixed(3);
                                    coords.z = (axes.z / 25.4).toFixed(3);
                                }
                                else if (axes.unit == "inch" && xyz.currentUnits === "mm") {
                                    coords.x = (axes.x * 25.4).toFixed(3);
                                    coords.y = (axes.y * 25.4).toFixed(3);
                                    coords.z = (axes.z * 25.4).toFixed(3);
                                }
                                else {
                                    coords.x = axes.x;
                                    coords.y = axes.y;
                                    coords.z = axes.z;
                                }

                                if ('x' in coords && coords.x != null) {
                                    xyz.updateAxis("x", coords.x);
                                }
                                if ('y' in coords && coords.y != null) {
                                    xyz.updateAxis("y", coords.y);
                                }
                                if ('z' in coords && coords.z != null) {
                                    xyz.updateAxis("z", coords.z);
                                }
                                if ('a' in coords && coords.a != null) {
                                    xyz.updateAxis("a", coords.a);
                                }
                            };

                            xyz.init();

                            chilipeppr.unsubscribe('/com-chilipeppr-widget-3dviewer/unitsChanged', xyz.updateUnitsFromStatus);

                            //remove wcs until it is fully baked
                            $('.btnToggleShowWcs').hide();
                            xyz.setupShowHideWcsBtn = function() {};

                            $('#com-chilipeppr-widget-xyz-ftr .joggotozero').attr("data-content", "G0 X0 Y0 Z0<br/>If you need to go to X0 Y0 first and then Z0, you can use the menus on the axes above.");

                            //bind the zero out button to G92 instead of G28
                            $('#com-chilipeppr-widget-xyz-ftr .jogzeroout').unbind("click");
                            $('#com-chilipeppr-widget-xyz-ftr .jogzeroout').click("xyz", xyz.zeroOutAxisG92.bind(xyz));
                            $('#com-chilipeppr-widget-xyz-ftr .jogzeroout').attr("data-content", "G92 X0 Y0 Z0 - Temporary offsets will be lost with grbl soft reset (ctrl+x) or when an M2 or M30 command is executed");

                            //update homing pop-up
                            $('#com-chilipeppr-widget-xyz-ftr .joghome').attr("data-content", "$H homing cycle - Must have limit switches and homing enabled in GRBL settings");

                            //clean up drop down lists (z)
                            $("#com-chilipeppr-widget-xyz-z .dropdown-menu li")[9].remove();
                            $("#com-chilipeppr-widget-xyz-z .dropdown-menu li")[8].remove();
                            $("#com-chilipeppr-widget-xyz-z .dropdown-menu li")[4].remove();
                            $("#com-chilipeppr-widget-xyz-z .dropdown-menu li")[3].remove();
                            $("#com-chilipeppr-widget-xyz-z .dropdown-menu li")[2].remove();
                            //clean up drop down lists (y)
                            $("#com-chilipeppr-widget-xyz-y .dropdown-menu li")[9].remove();
                            $("#com-chilipeppr-widget-xyz-y .dropdown-menu li")[8].remove();
                            $("#com-chilipeppr-widget-xyz-y .dropdown-menu li")[4].remove();
                            $("#com-chilipeppr-widget-xyz-y .dropdown-menu li")[3].remove();
                            $("#com-chilipeppr-widget-xyz-y .dropdown-menu li")[2].remove();
                            //clean up drop down lists (x)
                            $("#com-chilipeppr-widget-xyz-x .dropdown-menu li")[9].remove();
                            $("#com-chilipeppr-widget-xyz-x .dropdown-menu li")[8].remove();
                            $("#com-chilipeppr-widget-xyz-x .dropdown-menu li")[4].remove();
                            $("#com-chilipeppr-widget-xyz-x .dropdown-menu li")[3].remove();
                            $("#com-chilipeppr-widget-xyz-x .dropdown-menu li")[2].remove();

                            //remove A axis toggle option
                            $('#com-chilipeppr-widget-xyz .showhideaaxis').remove();

                            //remove existing keydown/keyup commands for jogging -- will replace these with our own keypress function
                            $('#com-chilipeppr-widget-xyz-ftr').unbind("keydown");
                            $('#com-chilipeppr-widget-xyz-ftr').unbind("keyup");

                            //create the keypress function
                            var that = xyz;
                            $('#com-chilipeppr-widget-xyz-ftr').keydown(function(evt) {
                                if (that.isInCustomMenu) {
                                    console.log("custom menu showing. not doing jog.");
                                    return true;
                                }

                                that.accelBaseValHilite(evt);

                                // if this keydown event does not contain a relevant keypress then just exit
                                if (!(evt.which > 30 && evt.which < 41)) {
                                    console.log("exiting cuz not arrow key. evt:", evt);
                                    return;
                                }

                                var key = evt.which;
                                var direction = null;

                                if (key == 38) {
                                    // up arrow. Y+
                                    direction = "Y+";
                                    $('#com-chilipeppr-widget-xyz-ftr .jogy').addClass("hilite");
                                    setTimeout(function() {
                                        $('#com-chilipeppr-widget-xyz-ftr .jogy').removeClass('hilite');
                                    }, 100);
                                }
                                else if (key == 40) {
                                    // down arrow. Y-
                                    direction = "Y-";
                                    $('#com-chilipeppr-widget-xyz-ftr .jogyneg').addClass("hilite");
                                    setTimeout(function() {
                                        $('#com-chilipeppr-widget-xyz-ftr .jogyneg').removeClass('hilite');
                                    }, 100);
                                }
                                else if (key == 37) {
                                    direction = "X-";
                                    $('#com-chilipeppr-widget-xyz-ftr .jogxneg').addClass("hilite");
                                    setTimeout(function() {
                                        $('#com-chilipeppr-widget-xyz-ftr .jogxneg').removeClass('hilite');
                                    }, 100);
                                }
                                else if (key == 39) {
                                    direction = "X+";
                                    $('#com-chilipeppr-widget-xyz-ftr .jogx').addClass("hilite");
                                    setTimeout(function() {
                                        $('#com-chilipeppr-widget-xyz-ftr .jogx').removeClass('hilite');
                                    }, 100);
                                }
                                else if (key == 33) {
                                    // page up
                                    direction = "Z+";
                                    $('#com-chilipeppr-widget-xyz-ftr .jogz').addClass("hilite");
                                    setTimeout(function() {
                                        $('#com-chilipeppr-widget-xyz-ftr .jogz').removeClass('hilite');
                                    }, 100);
                                }
                                else if (key == 34) {
                                    // page down
                                    direction = "Z-";
                                    $('#com-chilipeppr-widget-xyz-ftr .jogzneg').addClass("hilite");
                                    setTimeout(function() {
                                        $('#com-chilipeppr-widget-xyz-ftr .jogzneg').removeClass('hilite');
                                    }, 100);
                                }

                                if (direction) {
                                    //that.jog(direction, isFast, is100xFast, is1000xFast, is10000xFast);
                                    that.jog(direction);
                                }
                            });
                            // when key is up, we're done jogging
                            $('#com-chilipeppr-widget-xyz-ftr').keyup(function(evt) {
                                that.accelBaseValUnhilite();
                            });
                        });
                });

            // Serial Port Log Window
            // http://jsfiddle.net/chilipeppr/rczajbx0/
            chilipeppr.load("#com-chilipeppr-serialport-log",
                "http://fiddle.jshell.net/chilipeppr/rczajbx0/show/light/",

                function() {
                    cprequire(
                        ["inline:com-chilipeppr-widget-spconsole"],

                        function(spc) {

                            //stop spconsole from showing status requests responses from jsps
                            var oldOnRecvLine = spc.onRecvLine.bind(spc);
                            var newOnRecvLine = function(data) {
                                if (data.dataline.search(/^<|^\$G|^\?|^\[/) < 0 || $('#com-chilipeppr-widget-grbl .grbl-verbose').hasClass("enabled")) {
                                    data.dataline = data.dataline.replace("<", "&lt;").replace(">", "&gt;");
                                    oldOnRecvLine(data);
                                }
                            };
                            var oldJsonOnQueue = spc.jsonOnQueue.bind(spc);
                            var newJsonOnQueue = function(data) {
                                console.log("GRBL: AltJsonOnQueue: " + data);
                                if (data.D.search(/^<|^\$G|^\?|^\[/) < 0 || $('#com-chilipeppr-widget-grbl .grbl-verbose').hasClass("enabled")) {
                                    data.D = data.D.replace("<", "&lt;").replace(">", "&gt;");
                                    oldJsonOnQueue(data);
                                }
                            };

                            spc.onRecvLine = newOnRecvLine;
                            spc.jsonOnQueue = newJsonOnQueue;
                            spc.init(true, /^ok|^\n/);
                            $(window).on('resize', function(evt) {
                                if ($.isWindow(evt.target)) {
                                    spc.resize();
                                }
                            });
                            chilipeppr.subscribe("/com-chilipeppr-widget-gcode/resize", spc, spc.resize);
                        });
                });



            // GRBL
            // http://jsfiddle.net/jarret/b5L2rtgc/ //alternate test version of grbl controller
            // com-chilipeppr-grbl
            chilipeppr.load(
                "com-chilipeppr-grbl",
                "http://fiddle.jshell.net/jarret/9aaL8jg4/show/light/",

                function() {
                    cprequire(
                        ["inline:com-chilipeppr-widget-grbl"],
                        function(grbl) { //,spconsole) {
                            grbl.init();
                        });
                });

            // Serial Port Selector
            // http://jsfiddle.net/chilipeppr/vetj5fvx/
            chilipeppr.load("com-chilipeppr-serialport-spselector",
                "http://fiddle.jshell.net/chilipeppr/vetj5fvx/show/light/",
                function() {
                    cprequire(
                        ["inline:com-chilipeppr-widget-serialport"],
                        function(sp) {
                            console.log(sp);
                            alert("SP initialized");
                            sp.init(null, "grbl");
                        });
                });



        },



    }
});