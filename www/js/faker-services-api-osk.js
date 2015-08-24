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
    this.getByUnitId = function(id) {
        if(typeof id == 'string') id = parseInt(id);
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() {
                    var ret = _.filter(values, function(o) { return o.unit && o.unit.id == id; } );
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
        value.displayName = 'OSK Property';
        value.expireDate = faker.date.future();
        value.expireRemain = '';
        value.favourited = _.random(1) == 0;
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiPurchasedProperty', function($q,$timeout,apiProject) {
    var values = [];
    
    var index = 0;
    var value = {};
    value.id = index++;
    value.thumb = 'img/osk/DeveloperTrackRecord/purchased/Emira_with_logo.png'
    value.displayName = 'Emira'
    value.project = _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("emira") >= 0; });
    values.push(value);

    var value = {};
    value.id = index++;
    value.thumb = 'img/osk/DeveloperTrackRecord/purchased/Mirage_with_logo.png'
    value.displayName = 'Mirage'
    value.project = _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("mirage") >= 0; });
    values.push(value);

    var value = {};
    value.id =index++;
    value.thumb = 'img/osk/DeveloperTrackRecord/purchased/Opus_with_logo.png'
    value.displayName = 'Opus'
    value.project = _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("opus") >= 0; });
    values.push(value);

    var value = {};
    value.id = index++;
    value.thumb = 'img/osk/DeveloperTrackRecord/purchased/The_Vale_with_logo.png'
    value.displayName = 'The Vale'
    value.project = _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("vale") >= 0; });
    values.push(value);

    var value = {};
    value.id = index++;
    value.thumb = 'img/osk/DeveloperTrackRecord/purchased/gravitas_with_logo.png'
    value.displayName = 'Gravitas'
    value.project = _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("gravitas") >= 0; });
    values.push(value);

    var value = {};
    value.id = index++;
    value.thumb = 'img/osk/DeveloperTrackRecord/purchased/pangaea_with_logo.png'
    value.displayName = 'Pangaea'
    value.project = _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("pangaea") >= 0; });
    values.push(value);

    for(i = 0 ; i < values.length ; i++) {
        var value = values[i];
        value.area = faker.address.state();
        value.unitNo = faker.id.unitNo();
        value.unitId = faker.id.unitId();
        value.completionDate = faker.date.future();
        value.purchasedDate = faker.date.past();
        value.location = {
            latitude : faker.address.latitude(),
            longitude : faker.address.longitude()
        }
    }
    return new apiBaseService(values,$q,$timeout);
})


.service('apiConstruction', function($q,$timeout, apiProperty) {
    var values = []; 
    
    
    
    for(i = 0 ; i < 10 ; i++) {
        var property = _.sample(apiProperty.values);
        var value = {
            id:i,
            displayName: faker.company.companyName(),
            thumb:property.thumb,
            type:property.type,
            'property':property
        };
        values.push(value);
    }
    return new apiBaseService(values,$q,$timeout);
})

.service('apiConstructionProgress', function($q,$timeout,apiConstruction) {
    var progresses = [];
    for(i = 0 ; i < 10 ; i++) {
        var progress = {
            id:i,
            photoTakenDate: faker.date.past(),
            thumb:faker.image.progress(),
        };
        progresses.push(progress);
    }
    ret = new apiBaseService(progress,$q,$timeout);
    ret.getByConstrucitonId = function(id) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() {
                    var _construction = _.find(apiConstruction.values, function(o) { return id == o.id; });
                    var _value = {
                        construction:_construction,
                        progresses: progresses,
                        project: _construction.property.project
                    };
                    resolve(_value); 
                
                });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
    return ret;
})

.service('apiProperty', function($q,$timeout,apiProject) {
    var values = [];
    var index = 0;

    var value = null;
    value = {
        project: _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("gravitas") >= 0; }),
        id:index++,
        displayName: 'Gravitas',
        thumb:'img/osk/DeveloperTrackRecord/properties/Gravitas2.jpg',
        type:0,
        description:faker.lorem.paragraphs(),
    };
    values.push(value);

    value = {
        project: _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("opus") >= 0; }),
        id:index++,
        displayName: 'Opus2',
        thumb:'img/osk/DeveloperTrackRecord/properties/Opus2.jpg',
        type:1,
        description:faker.lorem.paragraphs(),
    };
    values.push(value);

    value = {
        project: _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("pangaea") >= 0; }),
        id:index++,
        displayName: 'Pangaea',
        thumb:'img/osk/DeveloperTrackRecord/properties/Pangaea_Overview.jpg',
        type:1,
        description:faker.lorem.paragraphs(),
    };
    values.push(value);

    value = {
        project: _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("vale") >= 0; }),
        id:index++,
        displayName: 'The Vale',
        thumb:'img/osk/DeveloperTrackRecord/properties/The_Vale.jpg',
        type:1,
        description:faker.lorem.paragraphs(),
    };
    values.push(value);

    value = {
        project: _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("emira") >= 0; }),
        id:index++,
        displayName: 'Emira',
        thumb:'img/osk/DeveloperTrackRecord/properties/emira.png',
        type:1,
        description:faker.lorem.paragraphs(),
    };
    values.push(value);

    value = {
        project: _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("mirage lake") >= 0; }),
        id:index++,
        displayName: 'Mirage Lake',
        thumb:'img/osk/DeveloperTrackRecord/properties/mirage_by_the_lake.jpg',
        type:1,
        description:faker.lorem.paragraphs(),
    };
    values.push(value);

    value = {
        project: _.find(apiProject.values, function(o){ return o.displayName.toLowerCase().indexOf("mirage residence") >= 0; }),
        id:index++,
        displayName: 'Mirage Residence',
        thumb:'img/osk/DeveloperTrackRecord/properties/mirage_residence.jpg',
        type:1,
        description:faker.lorem.paragraphs(),
    };
    values.push(value);

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
    var index = 0;
    this.values = values;

    var value

    value = {};
    value.id = index++;
    value.displayName = 'Gravitas'
    value.thumb = 'img/osk/DeveloperTrackRecord/osklogo/Gravitas_logo.jpg',
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
    values.push(value);

    value = {};
    value.id = index++;
    value.displayName = 'Mirage Lake'
    value.thumb = 'img/osk/DeveloperTrackRecord/osklogo/Mirage_Lake_logo.jpg',
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
    values.push(value);

    value = {};
    value.id = index++;
    value.displayName = 'Mirage Residence'
    value.thumb = 'img/osk/DeveloperTrackRecord/osklogo/Mirage_residence_logo.jpg',
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
    values.push(value);

    value = {};
    value.id = index++;
    value.displayName = 'OPUS'
    value.thumb = 'img/osk/DeveloperTrackRecord/osklogo/OPUS_lgog.jpg',
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
    values.push(value);

    value = {};
    value.id = index++;
    value.displayName = 'Pangaea'
    value.thumb = 'img/osk/DeveloperTrackRecord/osklogo/Pangaea_logo.jpg',
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
    values.push(value);

    value = {};
    value.id = index++;
    value.displayName = 'The Vale'
    value.thumb = 'img/osk/DeveloperTrackRecord/osklogo/The_Vale_Logo.jpg',
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
    values.push(value);
    
    value = {};
    value.id = index++;
    value.displayName = 'Emira'
    value.thumb = 'img/osk/DeveloperTrackRecord/osklogo/emiralogo.jpg',
    value.area = faker.address.state();
    value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
    values.push(value);

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
        {id:2, displayName:'Pending'},
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
    {id:0,displayName:'Electrical( include Power Point, Air Conditioner Point, Car Porch Ligh Point, DB Boxes & Cover)',},
    {id:1,displayName:'Contruction(include Ceiling, Door, Floor, Wall) ',},
    {id:2,displayName:'Plumbing(include Leaking, Sanitary Wares)',},
    {id:3,displayName:'Fitting(include Furniture, Rough Surface)',},
    {id:4,displayName:'Cleaning Service(Common Area & Staircase)',}     
    ];
    return new apiBaseService(values,$q,$timeout);
})

.service('apiUnit', function($q,$timeout,apiProject, apiUser,apiDefectItemAreaLocation) {
    var values = [];
    
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
                areaLocation: _.find(apiDefectItemAreaLocation.values, function(o) { return o.displayName.toLowerCase().indexOf('kitchen')==0; }),
                coords:'116, 114, 760, 725',
                shape:'rect'
                },
                {
                areaLocation: _.find(apiDefectItemAreaLocation.values, function(o) { return o.displayName.toLowerCase().indexOf('dining room')==0; }),
                coords:'760, 112, 1325, 724',
                shape:'rect'
                },
                {
                areaLocation: _.find(apiDefectItemAreaLocation.values, function(o) { return o.displayName.toLowerCase().indexOf('foyer')==0; }),
                coords:'117, 727, 600, 1323',
                shape:'rect'
                },
                {
                areaLocation: _.find(apiDefectItemAreaLocation.values, function(o) { return o.displayName.toLowerCase().indexOf('living room')==0; }),
                coords:'599, 726, 1324, 1327',
                shape:'rect'
                }
            ]
        }];
        value.owner = _.sample(apiUser.values);
        value.project = _.sample(apiProject.values);
        values.push(value);
    }
    
    return new apiBaseService(values,$q,$timeout);
})

.service('apiDefectItem', function($q,$timeout,
                                    apiUnit,
                                    apiDefectType,
                                    apiDefectItemSeverity,
                                    apiDefectItemReason,
                                    apiDefectItemStatus
                                   
                                   ) {
    var values = [];
    
    var unit = _.sample(apiUnit.values);
    
    values.push({
        id:0,
        project:unit.project,
        'unit':unit,
        defectSubmitDate : new Date(),
        defectLocation : 'img/defect/ceiling-crack-repair.jpg',
        defectType : _.sample(apiDefectType.values),
        defectItemSeverity : _.sample(apiDefectItemSeverity.values),
        defectItemReason : _.sample(apiDefectItemReason.values),
        defectItemStatus : _.sample(apiDefectItemStatus.values),
        defectItemAreaLocation : unit.floorplans[0].areas[0].areaLocation
    });
    
    return new apiBaseService(values,$q,$timeout);
})



//API Service End