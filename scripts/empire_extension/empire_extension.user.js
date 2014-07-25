// ==UserScript==
// @name           OGame Redesign Empire Extension
// @namespace      -
// @description    Extends OGame Redesign Empire with tooltips about costs of one level-higher buildings and research
// @include        http://*.ogame.*/game/index.php?*page=*
// @version        3.2.11
// ==/UserScript==

// jQuery
var unsafe = (typeof unsafeWindow) != "undefined" ? unsafeWindow : window;
var $ = unsafe.jQuery;
if ( !$ ) return;

// parameter:
// 1. name of the script
// 2. last ogame version on which the script have been tested
// 3. url to the update site of the script
oGameVersionCheck('OGame Redesign Empire Extension','5.5.4.99','http://userscripts.org/scripts/show/69715');

// global variables
var url = document.location.href;
var ogameUniverse = $('meta[name=ogame-universe]').attr('content');
var ogameTimestamp = $('meta[name=ogame-timestamp]').attr('content');

// officer
temp = GM_getValue(ogameUniverse + '_officers','0,0');
temp = temp.split(',');
var officer = {
        engineer:(temp[0] == '1' ? true : false),
        geologist:(temp[1] == '1' ? true : false)
    };

var costs = new Array();
    //			nr/id	metal		crystal		deuterium	factor
    costs.push({nr:1,	m:60,		c:15,		d:0,		f:1.5});
    costs.push({nr:2,	m:48,		c:24,		d:0,		f:1.6});
    costs.push({nr:3,	m:225,		c:75,		d:0,		f:1.5});
    costs.push({nr:4,	m:75,		c:30,		d:0,		f:1.5});
    costs.push({nr:12,	m:900,		c:360,		d:180,		f:1.8});
    costs.push({nr:14,	m:400,		c:120,		d:200,		f:2});
    costs.push({nr:15,	m:1000000,	c:500000,	d:100000,	f:2});
    costs.push({nr:21,	m:400,		c:200,		d:100,		f:2});
    costs.push({nr:22,	m:1000,		c:0,		d:0,		f:2});
    costs.push({nr:23,	m:1000,		c:500,		d:0,		f:2});
    costs.push({nr:24,	m:1000,		c:1000,		d:0,		f:2});
    costs.push({nr:25,	m:2645,		c:0,		d:0,		f:2.3});
    costs.push({nr:26,	m:2645,		c:1322,		d:0,		f:2.3});
    costs.push({nr:27,	m:2645,		c:2645,		d:0,		f:2.3});
    costs.push({nr:31,	m:200,		c:400,		d:200,		f:2});
    costs.push({nr:33,	m:0,		c:50000,	d:100000,	f:2});
    costs.push({nr:34,	m:20000,	c:40000,	d:0,		f:2});
    costs.push({nr:41,	m:20000,	c:40000,	d:20000,	f:2});
    costs.push({nr:42,	m:20000,	c:40000,	d:20000,	f:2});
    costs.push({nr:43,	m:2000000,	c:4000000,	d:2000000,	f:2});
    costs.push({nr:44,	m:20000,	c:20000,	d:1000,		f:2});
    costs.push({nr:106,	m:200,		c:1000,		d:200,		f:2});
    costs.push({nr:108,	m:0,		c:400,		d:600,		f:2});
    costs.push({nr:109,	m:800,		c:200,		d:0,		f:2});
    costs.push({nr:110,	m:200,		c:600,		d:0,		f:2});
    costs.push({nr:111,	m:1000,		c:0,		d:0,		f:2});
    costs.push({nr:113,	m:0,		c:800,		d:400,		f:2});
    costs.push({nr:114,	m:0,		c:4000,		d:2000,		f:2});
    costs.push({nr:115,	m:400,		c:0,		d:600,		f:2});
    costs.push({nr:117,	m:2000,		c:4000,		d:600,		f:2});
    costs.push({nr:118,	m:10000,	c:20000,	d:6000,		f:2});
    costs.push({nr:120,	m:200,		c:100,		d:0,		f:2});
    costs.push({nr:121,	m:1000,		c:300,		d:100,		f:2});
    costs.push({nr:122,	m:2000,		c:4000,		d:1000,		f:2});
    costs.push({nr:123,	m:240000,	c:400000,	d:160000,	f:2});
    costs.push({nr:124,	m:4000,		c:8000,		d:4000,		f:1.75});

    var capacity = new Array();
    capacity.push({nr:202,	tc:5000});
    capacity.push({nr:203,	tc:25000});
    capacity.push({nr:204,	tc:50});
    capacity.push({nr:205,	tc:100});
    capacity.push({nr:206,	tc:800});
    capacity.push({nr:207,	tc:1500});
    capacity.push({nr:208,	tc:7500});
    capacity.push({nr:209,	tc:20000});
    capacity.push({nr:211,	tc:500});
    capacity.push({nr:213,	tc:2000});
    capacity.push({nr:214,	tc:1000000});
    capacity.push({nr:215,	tc:750});

if (url.indexOf('empire') == -1) {
    temp = new Array();
    temp.push(($('#officers a.engineer').hasClass('on') ? '1' : '0')); // officer.engineer
    temp.push(($('#officers a.geologist').hasClass('on') ? '1' : '0')); // officer.geologist
    GM_setValue(ogameUniverse + '_officers',temp.join(','));
} else {
    // CSS changes
    newStyle = '#wrapTL { height:192px; }';
    newStyle += '.planetImg { width:100px; }';
    newStyle += '.planetImg img { width:100px; height:100px; }';
    newStyle += '#tab-left { height:104px; margin:-13px -4px 0 0; }';
    newStyle += '.planetHead { width:102px; }';
    newStyle += '.planetData { text-align:center; }';
    newStyle += '.planetData div { padding:0px; }';
    newStyle += '.planetname { width:106px; }';
    newStyle += '.planet { width:106px; }';
    newStyle += '.planetData ul { width:102px; text-align:center; }';
    newStyle += '.planetData li { width:91px; font:100 9px Verdana,Arial,SunSans-Regular,Sans-Serif; float:none; text-align:center; }';
    newStyle += 'div.row { width:106px; }';
    newStyle += 'div.values { width:102px; }';
    $('<style/>').attr('type','text/css').html(newStyle).appendTo($('head'));

    load(); // load script if dom is ready and ogame-javascripts are finished
}

function formatTime(value) {
    days = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
    // hours
    if (value >= 1) {
        hours = Math.floor(value);
        value = value - hours;
    }
    // minutes
    value = value * 60;
    if (value >= 1) {
        minutes = Math.floor(value);
        value = value - minutes;
    }
    // seconds
    value = value * 60;
    if (value >= 1) {
        seconds = Math.ceil(value);
        value = value - seconds;
    }
    // days
    if (hours >= 24) {
        days = Math.floor(hours / 24);
        hours = hours - (days * 24);
    }
    newTime = '';
    if (days > 0) newTime += days + 'd ';

    if (hours > 0 || days > 0) newTime += hours + 'h ';
    if (minutes > 0 || hours > 0 || days > 0) newTime += minutes + 'm ';
    newTime += seconds + 's ';
    return newTime;
}

function generateTooltipText(name, level, metalCosts, crystalCosts, deuteriumCosts, energyNeeded, metalPlanet, crystalPlanet, deuteriumPlanet, energyPlanet, metalAccount, crystalAccount, deuteriumAccount, metalProductionAccount, crystalProductionAccount, deuteriumProductionAccount) {
    text = '<div style="text-align:center">';
    text += '<span style="font-size:1.8em;font-weight:bold;">' + name + '</span><br/>';
    text += '<span style="font-size:1.5em;font-weight:bold;">next level: ' + (level + 1) + '</span><br/>';
    text += '<br />';
    points = Math.floor((metalCosts + crystalCosts + deuteriumCosts) / 1000);
    text += '<span style="text-decoration:underline;font-weight:bold;">costs </span>';
    text += '(<span style="text-decoration:underline;font-style:italic;">' + unsafe.tsdpkt(points) + ' points</span>)';
    text += '<span style="text-decoration:underline;font-weight:bold;">:</span><br/>';
    if (metalCosts > 0) text += '<span style="color:#FFCC00">metal: ' + unsafe.tsdpkt(metalCosts) + '</span><br/>';
    if (crystalCosts > 0) text += '<span style="color:#FFCC00">crystal: ' + unsafe.tsdpkt(crystalCosts) + '</span><br/>';
    if (deuteriumCosts > 0) text += '<span style="color:#FFCC00">deuterium: ' + unsafe.tsdpkt(deuteriumCosts) + '</span><br/>';
    if (energyNeeded > 0) text += '<span style="color:#FFCC00">energy: ' + unsafe.tsdpkt(energyNeeded) + '</span><br/>';
    text += '<span style="font-size:0.9em;">(small cargo: ' + unsafe.tsdpkt(Math.ceil((metalCosts + crystalCosts + deuteriumCosts) / 5000)) + ' or large cargo: ' + unsafe.tsdpkt(Math.ceil((metalCosts + crystalCosts + deuteriumCosts) / 25000)) + ')</span><br/>';
    text += '<br />';
    text += '<span style="text-decoration:underline;font-weight:bold;">ressources needed (planet):</span><br/>';
    tempAll = 0;
    temp = metalCosts - metalPlanet;
    if (temp > 0) {
        text += 'metal: ' + unsafe.tsdpkt(temp) + '<br/>';
        tempAll += temp;
    }
    temp = crystalCosts - crystalPlanet;
    if (temp > 0) {
        text += 'crystal: ' + unsafe.tsdpkt(temp) + '<br/>';
        tempAll += temp;
    }
    temp = deuteriumCosts - deuteriumPlanet;
    if (temp > 0) {
        text += 'deuterium: ' + unsafe.tsdpkt(temp) + '<br/>';
        tempAll += temp;
    }
    if (tempAll > 0) {
        text += '<span style="font-size:0.9em;">(small cargo: ' + unsafe.tsdpkt(Math.ceil(tempAll / 5000)) + ' or large cargo: ' + unsafe.tsdpkt(Math.ceil(tempAll / 25000)) + ')</span><br/>';
    }
    if (energyNeeded > 0 && energyNeeded > energyPlanet) {
        text += '<br />';
        temp = energyNeeded - energyPlanet;
        text += '<span style="text-decoration:underline;font-weight:bold;">energy needed:</span> ' + unsafe.tsdpkt(temp) + '<br/>';
    }
    if ((metalCosts - metalAccount) > 0 || (crystalCosts - crystalAccount) > 0 || (deuteriumCosts - deuteriumAccount) > 0) {
        time = 0;
        text += '<br />';
        text += '<span style="text-decoration:underline;font-weight:bold;">ressources needed (account):</span><br/>';
        temp = metalCosts - metalAccount;
        if (temp > 0) {
            text += 'metal: ' + unsafe.tsdpkt(temp) + '<br/>';
            if (metalProductionAccount > 0) {
                neededTime = temp / metalProductionAccount;
                if (neededTime > time) time = neededTime;
            }
        }
        temp = crystalCosts - crystalAccount;
        if (temp > 0) {
            text += 'crystal: ' + unsafe.tsdpkt(temp) + '<br/>';
            if (crystalProductionAccount > 0) {
                neededTime = temp / crystalProductionAccount;
                if (neededTime > time) time = neededTime;
            }
        }
        temp = deuteriumCosts - deuteriumAccount;
        if (temp > 0) {
            text += 'deuterium: ' + unsafe.tsdpkt(temp) + '<br/>';
            if (deuteriumProductionAccount > 0) {
                neededTime = temp / deuteriumProductionAccount;
                if (neededTime > time) time = neededTime;
            }
        }
        if (time > 0) {
            text += '<br />';
            text += '<span style="text-decoration:underline;font-weight:bold;">you will have enough ressources<br/>in your account in:</span><br/>';
            text += '<span style="color:orange;font-weight:bold;font-size:1.2em;">' + formatTime(time) + '</span><br/>';
            whatTime = new Date((parseInt(ogameTimestamp) + Math.ceil(time * 60 * 60)) * 1000);
            text += '<span style="color:#CCCCCC;font-size:1.0em;">' + whatTime.toLocaleString() + '</span><br/>';
        }
    } else {
        text += '<br />';
        text += '<span style="color:lime;font-weight:bold;font-size:1.2em;">there are enough ressources<br/>in your account</span><br/>';
    }
    text += '</div>';
    return text;
}

function load() {
    div = document.getElementsByTagName('div');
    if (div.length > 2) {
        init();
    } else {
        window.setTimeout(load, 999);
    }
}

function init() {
    // change empire width
    empireWidth = 180 + (106 * $('.planet').size());
    $('#mainWrapper').css('width',empireWidth);

    // ressources (account)
    $summary = $('.planet').filter('.summary');
    metalAccount = parseInt($summary.find('.metal').html().replace(/\./g,''));
    crystalAccount = parseInt($summary.find('.crystal').html().replace(/\./g,''));
    deuteriumAccount = parseInt($summary.find('.deuterium').html().replace(/\./g,''));
    totalRessourcesAccount = metalAccount + crystalAccount + deuteriumAccount;

    temp = $summary.find('.1').attr('title');
    metalProductionAccount = (temp != null ? parseInt((/.*\>([0-9.]+)\<.*\>([0-9.]+)\<.*\>([0-9.]+)\<.*/.exec(temp))[1].replace(/\./g,''),10) : 0);
    temp = $summary.find('.2').attr('title');
    crystalProductionAccount = (temp != null ? parseInt((/.*\>([0-9.]+)\<.*\>([0-9.]+)\<.*\>([0-9.]+)\<.*/.exec(temp))[1].replace(/\./g,''),10) : 0);
    temp = $summary.find('.3').attr('title');
    deuteriumProductionAccount = (temp != null ? parseInt((/.*\>([0-9.]+)\<.*\>([0-9.]+)\<.*\>([0-9.]+)\<.*/.exec(temp))[1].replace(/\./g,''),10) : 0);
    $header = $('div.header');

    // remove class 'catbox-end' from deuterium
    $header.find('.deuterium').removeClass('catbox-end');

    // total ressources (header)
    $new = $('<li/>');
    $('<span/>').html('total ressources').appendTo($new);
    $new.insertAfter($header.find('.deuterium'));

    // remove class 'box-end' from deuterium (summary)
    $summary.find('.deuterium').removeClass('box-end');

    // total ressources (summary)
    $new = $('<div/>').addClass('odd');
    $('<span/>').html(unsafe.tsdpkt(totalRessourcesAccount)).appendTo($new);
    $new.insertAfter($summary.find('.deuterium'));

    // transport capacity
    tcAccount = 0;
    $new = $('<li/>').addClass('catbox-end');
    $('<span/>').html('transport capacity').appendTo($new);
    $new.insertAfter($header.find('.deuterium').next());

    $('.planet').not('.summary').each(function(i){
        // energy lack
        if ($(this).find('div.planetDataTop span.overmark').size() > 0) {
            var energylack = parseInt( (/(\d+)/.exec($(this).find('div.planetDataTop span.overmark').html() || '').replace(/\./g,'')));
            var minTemperature = parseInt((/(^[\d\-]+).*/.exec($(this).find('div.planetDataBottom li.fields').html()))[1]);
            var solarSatelliteEnergy = Math.floor(Math.floor((minTemperature + 40 + 140) / 6) * (officer.engineer ? 1.1 : 1));
            var solarSatelliteNeeded = Math.ceil(energylack / solarSatelliteEnergy);
            $(this).find('div.planetDataTop span.overmark').parent().append($('<span/>').css('margin-left','5px').html('(' + solarSatelliteNeeded + ' sats)'));
        }

        // ressources (planet)
        var metalPlanet = parseInt( ( $(this).find('.metal span').html() || '' ).replace(/\./g,''), 10);
        var crystalPlanet = parseInt( ( $(this).find('.crystal span').html() || '' ).replace(/\./g,''), 10);
        var deuteriumPlanet = parseInt( ( $(this).find('.deuterium span').html() || '' ).replace(/\./g,''), 10);
        var energyPlanet = parseInt( ( $(this).find('div.planetDataTop span[class$="mark"]').html() || '' ).replace(/\./g,''), 10 );
        var totalRessourcesPlanet = metalPlanet + crystalPlanet + deuteriumPlanet;

        // remove class 'box-end' from deuterium
        $(this).find('.deuterium').removeClass('box-end');

        // total ressources (planet)
        $new = $('<div/>').addClass('odd');
        $('<span/>').html(unsafe.tsdpkt(totalRessourcesPlanet)).appendTo($new);
        $new.insertAfter($(this).find('.deuterium'));

        // transport capacity
        tcPlanet = 0;

        // graviton... research
        if ($header.find('.199').length > 0) {
            temp = $header.find('.199 span');
            name = temp.attr('title') || temp.html();
            $building = $(this).find('.199 span');
            if ($building.hasClass('disabled') && $building.html().indexOf('-') == -1) {
                level = parseInt($building.html());
                energyNeeded = 100000 * Math.pow(3, (level + 1));
                text = '<div style="text-align:center">';
                text += '<span style="font-size:1.8em;font-weight:bold;">' + name + '</span><br/>';
                text += '<span style="font-size:1.5em;font-weight:bold;">next level: ' + (level + 1) + '</span><br/>';
                text += '<br />';
                text += '<span style="text-decoration:underline;font-weight:bold;">costs:</span><br/>';
                text += '<span style="color:#FFCC00">energy: ' + unsafe.tsdpkt(energyNeeded) + '</span><br/>';
                text += '</div>';
                $building.attr('title',text).addClass('tooltipRight');
            }
        }
        // building, station, research (exclude: graviton...)
        for (a = 0; a < costs.length; a++) {
            if ($header.find('.' + costs[a].nr + '').size() > 0) {
                temp = $header.find('.' + costs[a].nr + ' span');
                name = temp.attr('title') || temp.html();
                $building = $(this).find('.' + costs[a].nr + ' span');
                if ($building.hasClass('disabled') && $building.html().indexOf('-') == -1) {
                    level = parseInt($building.html());
                    metalCosts = (costs[a].m == 0 ? 0 : Math.floor(costs[a].m * Math.pow(costs[a].f, level)));
                    crystalCosts = (costs[a].c == 0 ? 0 : Math.floor(costs[a].c * Math.pow(costs[a].f, level)));
                    deuteriumCosts = (costs[a].d == 0 ? 0 : Math.floor(costs[a].d * Math.pow(costs[a].f, level)));
                    energyBasis = 0;
                    if (costs[a].nr == 1 || costs[a].nr == 2) energyBasis = 10;
                    if (costs[a].nr == 3) energyBasis = 20;
                    energyActual = Math.ceil(energyBasis * level * Math.pow(1.1, level));
                    energyNext = Math.ceil(energyBasis * (level + 1) * Math.pow(1.1, (level + 1)));
                    energyNeeded = energyNext - energyActual;
                    text = generateTooltipText(name, level, metalCosts, crystalCosts, deuteriumCosts, energyNeeded, metalPlanet, crystalPlanet, deuteriumPlanet, energyPlanet, metalAccount, crystalAccount, deuteriumAccount, metalProductionAccount, crystalProductionAccount, deuteriumProductionAccount);
                    $building.attr('title',text).addClass('tooltipRight');
                }
            }
        }
        for (b	= 0; b < capacity.length; b++) {
            if ($header.find('.' + capacity[b].nr + '').size() > 0) {
                $ship = $(this).find('.' + capacity[b].nr);
                if ($ship.html().indexOf('-') == -1) {
                    countShips = parseInt($ship.html().replace(/\./g,''));
                    tcPlanet += (countShips * capacity[b].tc);
                }
            }
        }
        // transport capacity (planet: part 2)
        tcAccount += tcPlanet;
        $new = $('<div/>').addClass('even').addClass('box-end');
        $span = $('<span/>').html(unsafe.tsdpkt(tcPlanet)).appendTo($new);
        if (tcPlanet < totalRessourcesPlanet) {
            $span.addClass('disabled');
        }
        $new.insertAfter($(this).find('.deuterium').next());
    });

    // transport capacity (account: part 2)
    $new = $('<div/>').addClass('even').addClass('box-end');
    $span = $('<span/>').html(unsafe.tsdpkt(tcAccount)).appendTo($new);
    if (tcAccount < totalRessourcesAccount) {
        $span.addClass('disabled');
    }
    $new.insertAfter($summary.find('.deuterium').next());
}