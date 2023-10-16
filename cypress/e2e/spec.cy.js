import 'cypress-plugin-api';
import testData from "../fixtures/testData.json"

describe('GET methods', () => {
    let collection_id;
    let photo_id_random;
    let collection_for_photos;

    it('GET - user profile', () => {
        cy.api({
            url: `/users/${testData.username}/?client_id=${testData.token}`
        }).then((response) => {
            expect(response.status).eq(200);
            expect(response.body.first_name).eq(testData.first_name);
            expect(response.body.last_name).eq(testData.last_name);
            expect(response.body.username).eq(testData.username);
            expect(response.body.total_collections).eq(4)
        });
    })

    it('GET - user collections', () => {
        cy.request('GET', `/users/${testData.username}/collections/?client_id=${testData.token}`)
            .then(response => {
                expect(response.status).eq(200);
                expect(response.body.length).eq(9);
                collection_for_photos = response.body[2].id;
            })
    })

    it('POST- new collections', () => {
        cy.request({
            method: 'POST',
            url: `/collections`,
            headers: {
                "Authorization": `${testData.token_type} ${testData.access_token}`,
                "Content-Type": "application/json"
            },
            body: testData.new_collection
        }).then(response => {
            expect(response.status).eq(201);
            collection_id = response.body.id;
        })
    })

    it('GET - collection by ID', () => {
        cy.request('GET', `/collections/${collection_id}/?client_id=${testData.token}`)
            .then(response => {
                expect(response.status).eq(200);
                expect(response.body.id).eq(collection_id)
                expect(response.body.title).eq(testData.new_collection.title)
            })
    })

    it('GET - photos ', () => {
        cy.api({
            url: `/photos/?client_id=${testData.token}`
        }).then((response) => {
            expect(response.status).eq(200);
            expect(`${Cypress.config('baseUrl')}`).contains('api.unsplash.com');
            let array = response.body;
            let now = new Date();
            let now_formated = now.getFullYear() + '-' + (parseInt(now.getMonth()) + 1);
            array.forEach(element => {
                expect(element.alt_description).not.null;
                expect(element.updated_at).contain(now_formated);
                console.log(element)
            });
            let random_number = Math.floor(Math.random() * 10);
            photo_id_random = array[random_number].id;
        });
    })

    it('PUT - collection by ID', () => {
        cy.wait(300);
        cy.request({
            method: 'PUT',
            url: `/collections/${collection_id}`,
            headers: {
                "Authorization": `${testData.token_type} ${testData.access_token}`,
                "Content-Type": "application/json"
            },
            body: {
                "title": testData.new_title
            }
        }).then(response => {
            expect(response.status).eq(200);
            expect(response.body.id).eq(collection_id);
            expect(response.body.title).eq(testData.new_title);
        })
    })

    it('DELETE - collection by ID', () => {
        cy.wait(500);
        cy.request({
            method: 'DELETE',
            url: `/collections/${collection_id}`,
            headers: {
                "Authorization": `${testData.token_type} ${testData.access_token}`,
                "Content-Type": "application/json"
            }
        }).then(response => {
            expect(response.status).eq(204);
        })
    })

    it('POST add photo to collection ', () => {
        cy.request({
            method: 'POST',
            url: `/collections/${collection_for_photos}/add`,
            headers: {
                "Authorization": `${testData.token_type} ${testData.access_token}`,
                "Content-Type": "application/json"
            },
            body: {
                "collection_id": collection_for_photos,
                "photo_id": photo_id_random
            }
        }).then(response => {
            expect(response.status).eq(201);
        })
    })

    it('DELETE - photo from collection ', () => {
        cy.request({
            method: 'DELETE',
            url: `/collections/${collection_for_photos}/remove`,
            headers: {
                "Authorization": `${testData.token_type} ${testData.access_token}`,
                "Content-Type": "application/json"
            },
            body: {
                "collection_id": collection_for_photos,
                "photo_id": photo_id_random
            }
        }).then(response => {
            expect(response.status).eq(200);
        })
    })
})
