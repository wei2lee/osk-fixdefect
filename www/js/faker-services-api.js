function fakeNetworkDelay($timeout, f) {
    $timeout(f, Math.random() * 1000); 
}


angular.module('services-api', [])

//API Service Start
.service('apiUser', function($q, $timeout) {
    var _this = this;
    this.user = undefined;
    
    
    this.fakeUsers = [];
    this.fakeUsers.push({
        fullName:'Aqilah Shahrul',
        memberId:'9988112132301195',
        username:'Aqilah Shahrul',
        thumb:faker.image.avatar()
    });
    
    this.fakeUsers.push({
        fullName:'Jefferson Ng',
        memberId:'9988112132301201',
        username:'Jefferson Ng',
        thumb:faker.image.avatar()
    });
    
    this.fakeUsers.push({
        fullName:'Mahendran Arjuna',
        memberId:'9988112132301293',
        username:'Mahendran Arjuna',
        thumb:faker.image.avatar()
    });
    
    this.login = function(username, password) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() {
                    if(!username) {
                        reject({error_message:'Username must not be empty'});
                        return;   
                    }
                    
                    
                    var founded = _.find(_this.fakeUsers, {'username':username});
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
    
    this.logout = function() {
        _this.user = undefined;
    }
    
    this.getUser = function() {
        return _this.user;
    }
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
    this.getAll = function() {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() { resolve(values); });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
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
    
    var value = {
        progresses: progresses,
        project: {
            id:1,
            displayName: faker.company.companyName(),
            thumb:faker.image.projectLogo(),
        },

        construction:{
            id:1,
            displayName: faker.company.companyName(),
            thumb:faker.image.construction()
        }
    };
    this.getByConstrucitonId = function(id) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() { resolve(value); });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
})

.service('apiProperty', function($q,$timeout) {
    var values = [];
    var index = 0;
//    for(i = 0 ; i < 30 ; i++) {
//        var value = 
//        {
//            project: {
//                displayName : faker.company.projectName(),
//                thumb:faker.image.projectLogo()
//            },
//            id:i,
//            displayName: faker.company.propertyName(),
//            thumb:faker.image.property(),
//            type:_.random(2),
//            description:faker.lorem.paragraphs(),
//        };
//        values.push(value);
//    }
    
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
})

.service('apiProject', function($q,$timeout) {
    var values = [];
    for(i = 0 ; i < 10 ; i++) {
        var value = {};
        value.id = i;
        value.displayName = faker.company.projectName();
        value.thumb = faker.image.projectLogo();
        value.area = faker.address.state();
        value.address = faker.address.streetAddress() + ", " + faker.address.city() + ", " + faker.address.stateAbbr() + " " + faker.address.zipCode();
        values.push(value);
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
                    var ret = _.where(values, {'id':id})[0];
                    resolve(ret);
                });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
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
    
    this.getAll = function() {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0)
                fakeNetworkDelay($timeout, function() { resolve(values); });
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
})


.service('apiVoucher', function($q,$timeout) {
    var values = faker.table.vouchers();
    

    
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
})



.service('apiTicket', function($q,$timeout,apiEvent) {
    var index = 0;
    var values = [];
    value = {};
    value.id = index++;
    value.qrcode = faker.image.qrcode();
    value.event = apiEvent.values[0];
    values.push(value);
    
    this.addByEvent = function(event) {
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
    
    this.removeById = function(id) {
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
    
    this.removeByEvent = function(event) {
        return $q(function(resolve, reject) {
            if(Math.random() >= 0){
                    values = _.filter(values, function(o) { return o.event.id != event.id }); 
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
                    var ret = _.where(values, {'id':id})[0];
                    resolve(ret);
                });
            else
                fakeNetworkDelay($timeout, function() { reject({error_message:'fake error'}); });
        });
    }
})



//API Service End