const request = require('supertest');
const app = require('../app');
const TokenService = require('../services/token.service');

describe('Pictures EndPoints', () => {
  const admin = {
    id: 1,
    username: 'default.admin',
    email: 'default.admin@instaapi.lan',
    password: 'admin',
    Role: { id: 1, name: 'admin' }
  };

  const user = {
    id: 2,
    username: 'default.user',
    email: 'default.admin@instaapi.lan',
    password: 'user',
    Role: { id: 2, name: 'user' }
  };

  const adminToken = TokenService.generateToken(admin);
  const userToken = TokenService.generateToken(user);

  // GET LIST
  describe('GET /pictures', () => {
    it('Should fetch all pictures', async () => {
      await request(app)
        .get('/pictures')
        .expect('Content-Type', /json/)
        .expect(200);
    })
  });

  describe('GET /pictures/1', () => {
    it('Should fetch picture where id = 1', async () => {
      await request(app)
        .get('/pictures/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.id).toEqual(1)
          expect(res.body.source)
          expect(res.body.desc)
          expect(res.body.Users)
        });
    })
  });

  // POST LIST
  describe('POST /pictures', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .post('/pictures')
        .attach('picture', './pictures/ASCII-ukiyowaves.png')
        .field('desc', 'Picture added without JWT')
        .expect(401)
    })
  })

  describe('POST /pictures', () => {
    it('Should insert if token', async () => {
      await request(app)
        .post('/pictures')
        .set('Authorization', 'Bearer ' + userToken)
        .attach('picture', './pictures/ASCII-ukiyowaves.png')
        .field('desc', 'Picture added by ' + user.username)
        .expect('Content-Type', /json/)
        .expect(201)
    })
  })

  // PUT
  describe('PUT /pictures/3', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .put('/pictures/3')
        .send({ 'desc': 'Description edited without JWT' })
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('PUT /pictures/1', () => {
    it('Should return an error if picture.UserId != token.id', async () => {
      await request(app)
        .put('/pictures/1')
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'desc': 'Description edited by ' + user.username })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('PUT /pictures/3', () => {
    it('Should update picture if picture.UserId != token.id', async () => {
      await request(app)
        .put('/pictures/3')
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'desc': 'Description edited by ' + user.username })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('PUT /pictures/3', () => {
    it('Should update picture if user.role == \'admin\'', async () => {
      await request(app)
        .put('/pictures/3')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'desc': 'Description edited by ' + admin.username })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  // DELETE
  describe('DELETE /pictures/3', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .delete('/pictures/3')
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('DELETE /pictures/1', () => {
    it('Should return an error if picture.UserId != token.id', async () => {
      await request(app)
        .delete('/pictures/1')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('DELETE /pictures/3', () => {
    it('Should delete picture if picture.UserId != token.id', async () => {
      await request(app)
        .delete('/pictures/3')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('DELETE /pictures/2', () => {
    it('Should delete picture if token.role == \'admin\'', async () => {
      await request(app)
        .delete('/pictures/2')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
});