//
// Component tests
//

// Due to time constraints, here's a hardcoded token
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzA2YTM3MzQxZmVlZjY0NDA1NTNkY2IiLCJlbWFpbCI6ImJhc3ZhbnJvb3RlbkBtZS5jb20iLCJmaXJzdE5hbWUiOiJCYXMiLCJsYXN0TmFtZSI6InZhbiBSb290ZW4iLCJwZXJtaXNzaW9ucyI6MCwiaWF0IjoxNTQ0NjQ3ODIwLCJleHAiOjE1NDcyMzk4MjB9._va33xz7DiM9Dv_CrfKxpPc6EioPXzqK9M8hGRV2C_M";


// Test dependencies
const assert = require('assert');
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Component = mongoose.model('component');


describe('Testing the component controller', function() {

    it('saves an activity to the database', (done) => {
        // Post new user
        Component.countDocuments().then(count => {
            request(app)
            .post('/api/component/')
            .set('Authorization', 'Bearer ' + token)
            .send({
              "name": "Unit tests Component test",
              "expressionField": "Unit Tests",
              "duration": 123,
              "budget": 123,
              "componentText": "Hee Adela, jij kent mij vast nog wel. Ik ben Fransica, de vriendin van Michel. Ik heb van Michel gehoord dat jij een Jan Smit app aangemaakt hebt en dat jij probeert onze leden af te pakken waar haal jij het gore teringlef vandaan tering tering teringwijf. Je laat gewoon iedereen met rust. Ze willen toch niet bij jou in de groep, want k heb, wij hebben allemaal iedereen al op de hoogte gebracht dat wij dat en niemand wil bij jou in de groep. Iedereen die jij toevoegt van onze Jan Smit app, die gaan zich gelijk er weer uitgooien. Daar heb ik wel voor gezorgd en Michel en Mark en de andere beheerders maar die ken je niet. Maar wat ben je waar haal jij het gore lef vandaan om onze vrienden af te pakken met je tyfus cholera kop. Je mag van mij lekker de tyfus krijgen. De tering en de cholera. En je laat iedereen van mijn Jan Smit app gewoon met RUST. Klaar. Basta. Want ik weet je ik weet je altijd wel te vinden hoor. Dusseh pas maar op met je teringtyfuscholerakop. Want ik weet je altijd wel te vinden. Als jij hier mee doorgaat dan ga ik je opzoeken. Ik weet je toch wel te vinden. Ik heb connecties genoeg. Dus pas maar op teringwijf."
            })
            .end((err, res) => {
                Component.countDocuments().then(newCount => {
                    Component.findByIdAndDelete(res.body._id).then(() => {
                        // Check if server returns status 200
                        assert(count + 1 === newCount);
                        assert(res.statusCode === 200);
                        done();
                    });
                });
            });
        });
    });

    it('should throw an error when adding activity with invalid name', (done) => {
        // Post new user
        Component.countDocuments().then(count => {
            request(app)
            .post('/api/component/')
            .set('Authorization', 'Bearer ' + token)
            .send({
              "name": "UT",
              "expressionField": "Unit Tests",
              "duration": 123,
              "budget": 123,
              "componentText": "This is not supposed to be saved"
            })
            .end((err, res) => {
                Component.countDocuments().then(newCount => {
                    Component.findByIdAndDelete(res.body._id).then(() => {
                        // Check if server returns status 200
                        assert(count  === newCount);
                        assert(res.statusCode === 412);
                        done();
                    });
                });
            });
        });
    });

    it('should throw an error when adding activity with invalid componentText', (done) => {
        // Post new user
        Component.countDocuments().then(count => {
            request(app)
            .post('/api/component/')
            .set('Authorization', 'Bearer ' + token)
            .send({
              "name": "Unit Tests invalid componentText value",
              "expressionField": "Unit Tests",
              "duration": 123,
              "budget": 123,
              "componentText": "Invalid value"
            })
            .end((err, res) => {
                Component.countDocuments().then(newCount => {
                    Component.findByIdAndDelete(res.body._id).then(() => {
                        // Check if server returns status 200
                        assert(count  === newCount);
                        assert(res.statusCode === 412);
                        done();
                    });
                });
            });
        });
    });

    it('gets a component by ID', (done) => {
        // Create new component
        const newComponent = new Component({
            "name": "Unit tests Component test",
            "expressionField": "Unit Tests",
            "duration": 123,
            "budget": 123,
            "componentText": "Hee Adela, jij kent mij vast nog wel. Ik ben Fransica, de vriendin van Michel. Ik heb van Michel gehoord dat jij een Jan Smit app aangemaakt hebt en dat jij probeert onze leden af te pakken waar haal jij het gore teringlef vandaan tering tering teringwijf. Je laat gewoon iedereen met rust. Ze willen toch niet bij jou in de groep, want k heb, wij hebben allemaal iedereen al op de hoogte gebracht dat wij dat en niemand wil bij jou in de groep. Iedereen die jij toevoegt van onze Jan Smit app, die gaan zich gelijk er weer uitgooien. Daar heb ik wel voor gezorgd en Michel en Mark en de andere beheerders maar die ken je niet. Maar wat ben je waar haal jij het gore lef vandaan om onze vrienden af te pakken met je tyfus cholera kop. Je mag van mij lekker de tyfus krijgen. De tering en de cholera. En je laat iedereen van mijn Jan Smit app gewoon met RUST. Klaar. Basta. Want ik weet je ik weet je altijd wel te vinden hoor. Dusseh pas maar op met je teringtyfuscholerakop. Want ik weet je altijd wel te vinden. Als jij hier mee doorgaat dan ga ik je opzoeken. Ik weet je toch wel te vinden. Ik heb connecties genoeg. Dus pas maar op teringwijf."
        });

        newComponent.save().then(component => {
            const componentId = component._id;

            // Get thread by ID
            request(app)
                .get('/api/component/' + componentId)
                .set('Authorization', 'Bearer ' + token)
                .end((err, res) => {
                    newComponent.delete().then(() => {
                        assert(res.statusCode === 200);
                        done();
                    })
                });
        })

    });

    it('deletes a component by ID', (done) => {
        // Create new component
        const newComponent = new Component({
            "name": "Unit tests Delete component by ID",
            "expressionField": "Unit Tests",
            "duration": 123,
            "budget": 123,
            "componentText": "Hee Adela, jij kent mij vast nog wel. Ik ben Fransica, de vriendin van Michel. Ik heb van Michel gehoord dat jij een Jan Smit app aangemaakt hebt en dat jij probeert onze leden af te pakken waar haal jij het gore teringlef vandaan tering tering teringwijf. Je laat gewoon iedereen met rust. Ze willen toch niet bij jou in de groep, want k heb, wij hebben allemaal iedereen al op de hoogte gebracht dat wij dat en niemand wil bij jou in de groep. Iedereen die jij toevoegt van onze Jan Smit app, die gaan zich gelijk er weer uitgooien. Daar heb ik wel voor gezorgd en Michel en Mark en de andere beheerders maar die ken je niet. Maar wat ben je waar haal jij het gore lef vandaan om onze vrienden af te pakken met je tyfus cholera kop. Je mag van mij lekker de tyfus krijgen. De tering en de cholera. En je laat iedereen van mijn Jan Smit app gewoon met RUST. Klaar. Basta. Want ik weet je ik weet je altijd wel te vinden hoor. Dusseh pas maar op met je teringtyfuscholerakop. Want ik weet je altijd wel te vinden. Als jij hier mee doorgaat dan ga ik je opzoeken. Ik weet je toch wel te vinden. Ik heb connecties genoeg. Dus pas maar op teringwijf."
        });

        newComponent.save().then(component => {
            const componentId = component._id;

            Component.countDocuments().then(count => {
                // Delete component by ID
                request(app)
                    .delete('/api/component/' + componentId)
                    .set('Authorization', 'Bearer ' + token)
                    .end((err, res) => {
                        Component.countDocuments().then(newCount => {
                            assert(count - 1 === newCount)
                            assert(res.statusCode === 200);
                            done();
                        });
                    });
            });
        });
    }); 

});