function fakeNetworkDelay($timeout, f) {
    $timeout(f, Math.random() * 1000); 
}

function apiBaseService(_values, $q, $timeout) {
    var _this = this;
    this.values = _values;
    var values = this.values;
    var index = 1000;
    
    this.add = function(o) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() { 
                    if(Array.isArray(o)) {
                        for(i = 0 ; i < o.length ; i++) {
                            o[i].id = index++;
                            values.push(o[i]);
                        }
                    }else{
                        o.id = index++;
                        values.push(o);
                    }
                    resolve(null); 
                });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
    
    this.removeById = function(id) {
        if(typeof id == 'string') id = parseInt(id);
        return $q(function(resolve, reject) {
            if(Math.random() >= 0){
                    values = _.filter(values, function(o) { return o.id != id }); 
                    fakeNetworkDelay($timeout, function() { 
                    resolve(null); 
                });
            }else{
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
            }
        });
    }
    
    this.remove = function(_o) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0){
                    values = _.filter(values, function(o) { return o.id != _o.id }); 
                    fakeNetworkDelay($timeout, function() { 
                    resolve(null); 
                });
            }else{
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
            }
        });
    }
    
    this.getAll = function() {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() { resolve(values); });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
    
    this.getById = function(id) {
        if(typeof id == 'string') id = parseInt(id);
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() {
                    resolve(_.where(values, {'id':id})[0]);
                });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
    
    this.getByProjectId = function(id) {
        if(typeof id == 'string') id = parseInt(id);
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() {
                    var ret = _.filter(values, function(o) { return o.project && o.project.id == id; } );
                    resolve(ret);
                });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
}


angular.module('services-api', [])


//API Service Start
.service('apiUser', function($q, $timeout) {
    var _this = this;
    this.user = undefined;
    
    
    this.values = [];
    var values = this.values;
    values.push({
        id:0,
        fullName:'Aqilah Shahrul',
        memberId:'9988112132301195',
        username:'Aqilah Shahrul',
        thumb:faker.image.avatar(),
        nric:'901202-08-5678',
        contact:faker.phone.phoneNumber()
    });
    
    values.push({
        id:1,
        fullName:'Jefferson Ng',
        memberId:'9988112132301201',
        username:'Jefferson Ng',
        thumb:faker.image.avatar(),
        nric:'901202-08-5678',
        contact:faker.phone.phoneNumber()
    });
    values.push({
        id:2,
        fullName:'Mahendran Arjuna',
        memberId:'9988112132301293',
        username:'Mahendran Arjuna',
        thumb:faker.image.avatar(),
        nric:'901202-08-5678',
        contact:faker.phone.phoneNumber()
    });
    
    ret = new apiBaseService(values,$q,$timeout);
    
    ret.login = function(username, password) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() {
                    if(!username) {
                        reject({error_message:'Username must not be empty'});
                        return;   
                    }
                    
                    
                    var founded = _.find(_this.values, {'username':username});
                    if(founded) {
                        _this.user = founded;
                        resolve(founded);                        
                    }else{
                        reject({error_message:'User doen\'t match with password'});
                    }
                });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
    
    ret.logout = function() {
        _this.user = undefined;
    }
    
    ret.getUser = function() {
        return _this.user;
    }
    
    return ret;
})


.service('apiWhatsNewItem', function($q,$timeout){
    var values = [];
    for(i = 0 ; i < 10 ; i++) {
        var value = {};
        value.id = i;
        value.type = _.random(1); // 0 = news, 1 = event
        value.thumb = faker.image.event();
        value.period = '12-14 JUNE, 11pm-5pm';
        value.displayName = faker.company.companyName();
        value.expireDate = faker.date.future();
        value.expireRemain = '';
        value.favourited = _.random(1) == 0;
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiPurchasedProperty', function($q,$timeout) {
    var values = [];
    for(i = 0 ; i < 10 ; i++) {
        var value = {};
        value.id = i;
        value.thumb = faker.image.property();
        value.displayName = faker.company.propertyName();
        value.project = {
            displayName : faker.company.projectName(),
            thumb:faker.image.property()
        };
        value.area = faker.address.state();
        value.unitNo = faker.id.unitNo();
        value.unitId = faker.id.unitId();
        value.completionDate = faker.date.future();
        value.purchasedDate = faker.date.past();
        value.location = {
            latitude : faker.address.latitude(),
            longitude : faker.address.longitude()
        }
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})


.service('apiConstruction', function($q,$timeout) {
    var values = []; 
    for(i = 0 ; i < 10 ; i++) {
        var value = {
            id:i,
            displayName: faker.company.companyName(),
            thumb:faker.image.property(),
            type:_.random(2)
        };
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiConstructionProgress', function($q,$timeout) {
    var progresses = [];
    for(i = 0 ; i < 10 ; i++) {
        var value = {
            id:i,
            photoTakenDate: faker.date.past(),
            thumb:faker.image.progress(),
        };
        progresses.push(value);
    }
    ret = new apiBaseService(values,$q,$timeout);
    ret.getByConstrucitonId = function(id) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() { resolve(value); });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
    return ret;
})

.service('apiProperty', function($q,$timeout) {
    var values = [];
    var ps = faker.table.properties();
    values.push(ps[0],ps[1],ps[2]);
    for(i = 3 ; i < 30 ; i++) {
        var value = 
        {
            project: {
                displayName : faker.company.projectName(),
                thumb:faker.image.projectLogo()
            },
            id:i,
            displayName: faker.company.propertyName(),
            thumb:faker.image.property(),
            type:_.random(1) + 1,
            description:faker.lorem.paragraphs(),
        };
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiEvent', function($q,$timeout) {
    var values = []; this.values = values;
    for(i = 0 ; i < 10 ; i++) {
        var value = {};
        value.id = i;
        value.thumb = faker.image.event();
        value.description = faker.lorem.paragraphs();
        value.period = '12-14 JUNE, 11pm-5pm';
        value.displayName = faker.company.projectName();
        value.expireDate = faker.date.future();
        value.expireRemain = '';
        value.area = faker.address.state();
        value.address = faker.address.streetAddress() + ', ' + faker.address.city() + ', ' + faker.address.state() + ', ' + faker.address.country();
        value.location = {
            latitude:faker.address.latitude(),
            longitude:faker.address.longitude()
        };
        value.distance = sprintf("%.1f ", Math.random() * 100) + 'KM';
        value.type = _.random(1);
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiProject', function($q,$timeout) {
    var values = [];
    this.values = values;
    for(i = 0 ; i < 10 ; i++) {
        var value = {};
        value.id = i;
        value.displayName = faker.company.projectName();
        value.thumb = faker.image.projectLogo();
        value.area = faker.address.state();
        value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiConsultant', function($q,$timeout) {
    var values = [];
    for(i = 0 ; i < 90 ; i++) {
        var firstName = faker.name.firstName(), lastName = faker.name.lastName();
        var value = {};
        value.id = i;
        value.fullName = faker.name.findName(firstName, lastName);
        value.thumb = faker.internet.avatar();
        value.project = {
            id:_.random(9)  
        };
        value.contact = faker.phone.phoneNumber();
        value.email = faker.internet.email(firstName, lastName)
        value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})


.service('apiVoucher', function($q,$timeout) {
    var values = faker.table.vouchers();
    return new apiBaseService(values,$q,$timeout);
})



.service('apiTicket', function($q,$timeout,apiEvent) {
    var index = 0;
    var values = [];
    value = {};
    value.id = index++;
    value.qrcode = faker.image.qrcode();
    value.event = apiEvent.values[0];
    values.push(value);
    
    ret = new apiBaseService(values,$q,$timeout);
    ret.addByEvent = function(event) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0){
                var value = {};
                value.id = index++;
                value.qrcode = faker.image.qrcode();
                value.event = event;
                values.push(value);
                fakeNetworkDelay($timeout, function() { 
                    resolve(null); 
                });
            }else{
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
            }
        });
    }
    return ret;
})

.service('apiDefectItemAreaLocation', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
{displayName:'Living and Dining Room', id:1},
{displayName:'Kitchen', id:2},
{displayName:'Master Bedroom', id:3},
{displayName:'Bedroom 2', id:4},
{displayName:'Bedroom 3', id:5},
{displayName:'Bedroom 4', id:6},
{displayName:'Ceiling', id:7},
{displayName:'Location(Migration)', id:8},
{displayName:'Master Bed', id:9},
{displayName:' Car Park - Ceiling', id:10},
{displayName:'Kitchen - Ceiling', id:11},
{displayName:'Car Porch', id:12},
{displayName:'Living Room', id:13},
{displayName:'Dining Room', id:14},
{displayName:'Master Bedroom', id:15},
{displayName:'Bedroom 1', id:16},
{displayName:'Bedroom 2', id:17},
{displayName:'Bedroom 3', id:18},
{displayName:'Family Room', id:19},
{displayName:'Utility Room', id:20},
{displayName:'Store Room', id:21},
{displayName:'Staircase', id:22},
{displayName:'Dry Kitchen', id:23},
{displayName:'Wet Kitchen', id:24},
{displayName:'Yard', id:25},
{displayName:'Master Bath', id:26},
{displayName:'Bathroom 2', id:27},
{displayName:'Bathroom 3', id:28},
{displayName:'Bed Room 4', id:29},
{displayName:'Standard/Common', id:30},
{displayName:'Retail / Office', id:31},
{displayName:'Retail Front ', id:32},
{displayName:'Retail Back ', id:33},
{displayName:'Office Front', id:34},
{displayName:'Office Back', id:35},
{displayName:'Toilet', id:36},
{displayName:'A/C Ledge (Front)', id:37},
{displayName:'A/C Ledge (Back)', id:38},
{displayName:'Retail', id:39},
{displayName:'Office', id:40},
{displayName:'A/C Ledge', id:41},
{displayName:'Foyer', id:42},
{displayName:'Patio', id:43},
{displayName:'Store 1', id:44},
{displayName:'Store 2', id:45},
{displayName:'Bedroom 4', id:46},
{displayName:'Terrace', id:47},
{displayName:'Bathroom 4', id:48},
{displayName:'Balcony', id:49},
{displayName:'Bedroom 5', id:50},
{displayName:'Bathroom 5', id:51},
{displayName:'Family Hall ', id:52},
{displayName:'Tandas', id:53},
{displayName:'Shower Area', id:54},
{displayName:'testing', id:55},
{displayName:'Compartment', id:56},
{displayName:'Roof', id:57},
{displayName:'Others', id:58},
{displayName:'Fencing', id:59},
{displayName:'garden', id:60},
{displayName:'Driveway', id:61},
{displayName:'Guest Room', id:62},
{displayName:'Bathroom 6', id:63},
{displayName:'External Back Wall (Ground Floor)', id:64},
{displayName:'External Back Wall (First Floor)', id:65},
{displayName:'Study Area', id:66},
{displayName:'Bedroom 1', id:67},
{displayName:'Wash', id:68},
{displayName:'Store 3', id:69},
{displayName:'Bathroom 1', id:70},
{displayName:'Linen', id:71},
{displayName:'turfing', id:72},
{displayName:'Open Terrace', id:73},
{displayName:'Kitchen', id:74},
{displayName:'Balcony 1', id:75},
{displayName:'Balcony 2', id:76},
{displayName:'Master Bedroom 2', id:77},
{displayName:'Terrace 1', id:78},
{displayName:'Terrace 2', id:79},
{displayName:'Laundry', id:80},
{displayName:'Planter', id:81},
{displayName:'Planter', id:82},
{displayName:'Maid\'s Room', id:83},
{displayName:'Letter Box', id:84},
{displayName:'Void Area', id:85},
{displayName:'Utility 2', id:86},
{displayName:'Paved Area', id:87},
{displayName:'Powder Room', id:88},
{displayName:'Drying Yard', id:89},
{displayName:'Refuse Chamber', id:90},
{displayName:'Courtyard', id:91},
{displayName:'Production Area', id:92},
{displayName:'Reception Lobby', id:93},
{displayName:'General Office', id:94},
{displayName:'Executive Office', id:95},
{displayName:'Pump Room', id:96},
{displayName:'Porch', id:97},
{displayName:'Roof Terrace', id:98},
{displayName:'Guard House', id:99},
{displayName:'Bedroom 6', id:100},
{displayName:'Bedroom 7', id:101},
{displayName:'Bathroom 7', id:102},
{displayName:'Corridor', id:103},
{displayName:'Walk-In Closet', id:104},
{displayName:'Shop', id:105},
{displayName:'General office 1', id:106},
{displayName:'General office 2', id:107},
{displayName:'Office 2', id:108}
    
    ];
    return new apiBaseService(values,$q,$timeout);
})

.service('apiDefectItemReason', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
        {id:0, displayName:'Not Applicable'},
        {id:1, displayName:'Work Of Nature'}
    ];
    return new apiBaseService(values,$q,$timeout);
})


.service('apiDefectItemStatus', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
        {id:1, displayName:'In Progress'},
        {id:2, displayName:'Not Started'},
        {id:3, displayName:'Completed'}
    ];
    return new apiBaseService(values,$q,$timeout);
})
         
.service('apiDefectItemSeverity', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
        {id:1, displayName:'Low'},
        {id:2, displayName:'Medium'},
        {id:3, displayName:'High'}
    ];
    return new apiBaseService(values,$q,$timeout);
})

.service('apiDefectType', function($q,$timeout) {
    var values = [];
    this.values = values;
    
    values = [
    {id:0,displayName:'Ceiling - C1  Rough surface / chipped / cracked / damaged / broken',},
    {id:1,displayName:'Ceiling - C4  Others',},
    {id:2,displayName:'Door (include door panel, frame, glazing, architrave, heelstone, roller shutter, etc) - D1  Rough surface / poor joint / chipped / cracked / damaged / dented / sagged / warped / scratched',},
    {id:3,displayName:'Door (include door panel, frame, glazing, architrave, heelstone, roller shutter, etc) - D2  Misaligned / unlevel',},
    {id:4,displayName:'Door (include door panel, frame, glazing, architrave, heelstone, roller shutter, etc) - D3  Visible gap / inconsistent gap / poor pointing',},
    {id:5,displayName:'Floor (include screeding, tiles, parquet, timber strips, etc) - F2  Rough surface / patchy / scratched',},
    {id:6,displayName:'Plaster Wall / Paintwork - PW2  Rough surface / bulging / hollowness / chipped / pin hole',},
    {id:7,displayName:'Sanitary wares & fittings / Plumbing - S1  Leaking (e.g. pipe, slab, water tank, etc.',},
    {id:8,displayName:'Wall Tiles - T1  Broken / chipped / cracked / hollowness',},
    {id:9,displayName:'Electrical - 13amp Power Point c/w Cover',},
    {id:10,displayName:'Electrical - Air Conditioner Point c/w Switch',},
    {id:11,displayName:'Electrical - Car Porch Light Point',},
    {id:12,displayName:'Electrical - DB Boxes & Cover',},
    {id:13,displayName:'Cleaning Services',},
    {id:14,displayName:'Cleaning Common Area',},
    {id:15,displayName:'Cleaning Staircase',},
    {id:16,displayName:'Cleaning Staircase',},
    {id:17,displayName:'Normal Cleaning',}         
    ];
    return new apiBaseService(values,$q,$timeout);
})

.service('apiUnit', function($q,$timeout,apiProject, apiUser, apiDefectItemAreaLocation) {
    var values = [];
    
//    <img src="floor_plan_example5.png" alt="" usemap="#map" />
//<map name="map">
//    <area shape="rect" coords="599, 724, 1322, 1325" />
//    <area shape="rect" coords="121, 723, 600, 1325" />
//    <area shape="rect" coords="766, 119, 1322, 725" />
//    <area shape="rect" coords="118, 120, 764, 725" />
//</map>
    
    for(i = 0 ; i < 200 ; i++) {
        var value = {};
        value.id = i;
        value.unitNo = faker.id.unitNo();
        value.type = ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1'][_.random(6)];
        value.view = ['East','West','South', 'South'][_.random(3)];
        value.size = _.random(500,2000);
        value.floorplans = [{
            displayName:'LEVEL 1',
            thumb:'img/floorplan/floor_plan_example5.png',
            areas:[
                {
                areaLocation: _.find(apiDefectItemAreaLocation, function(o) { return o.displayName.toLowerCase().indexOf('kicthen')>=0; }),
                coords:'118, 120, 764, 725',
                shape:'rect'
                },
                {
                areaLocation: _.find(apiDefectItemAreaLocation, function(o) { return o.displayName.toLowerCase().indexOf('dining')>=0; }),
                coords:'766, 119, 1322, 725',
                shape:'rect'
                },
                {
                areaLocation: _.find(apiDefectItemAreaLocation, function(o) { return o.displayName.toLowerCase().indexOf('foyer')>=0; }),
                coords:'121, 723, 600, 1325',
                shape:'rect'
                },
                {
                areaLocation: _.find(apiDefectItemAreaLocation, function(o) { return o.displayName.toLowerCase().indexOf('living room')>=0; }),
                coords:'766, 119, 1322, 725',
                shape:'rect'
                }
            ]
        }];
        value.owner = _.sample(apiUser.values);
        value.project = _.sample(apiProject.values);
        values.push(value);
    }
    
    
    console.log(values);
    
    return new apiBaseService(values,$q,$timeout);
})

.service('apiDefectItem', function($q,$timeout) {
    var values = [];
    
    
    
    
    return new apiBaseService(values,$q,$timeout);
})



//API Service End