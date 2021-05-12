const request = require('supertest');
const app = require('../app');
const TokenService = require('../services/token.service');

describe('Roles EndPoints', () => {
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
  describe('GET /roles', () => {
    it('Should fetch all roles', async () => {
      await request(app)
        .get('/roles')
        .expect('Content-Type', /json/)
        .expect(200);
    })
  });

  describe('GET /roles/1', () => {
    it('Should fetch admin role', async () => {
      await request(app)
        .get('/roles/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.id).toEqual(1)
          expect(res.body.name).toEqual('admin')
        });
    })
  });

  // POST LIST
  describe('POST /roles', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .post('/roles')
        .send({ 'name': 'role added without jwt' })
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('POST /roles', () => {
    it('Should return an error if role is not admin', async () => {
      await request(app)
        .post('/roles')
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'name': 'role added with user role' })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('POST /roles', () => {
    it('Should insert role if user role is admin', async () => {
      await request(app)
        .post('/roles')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'name': 'role added with admin role' })
        .expect('Content-Type', /json/)
        .expect(201)
    })
  })

  describe('POST /roles', () => {
    it('Should return error if role name already exist', async () => {
      await request(app)
        .post('/roles')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'name': 'role added with admin role' })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  // PUT
  describe('PUT /roles/3', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .put('/roles/3')
        .send({ 'name': 'role edited without jwt' })
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('PUT /roles/3', () => {
    it('Should return an error if role is not admin', async () => {
      await request(app)
        .put('/roles/3')
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'name': 'role edited with user role' })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('PUT /roles/3', () => {
    it('Should update role if user role is admin', async () => {
      await request(app)
        .put('/roles/3')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'name': 'role edited with admin role' })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('PUT /roles/3', () => {
    it('Should return error if role name already exist', async () => {
      await request(app)
        .put('/roles/3')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'name': 'user' })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  // DELETE
  describe('DELETE /roles/3', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .delete('/roles/3')
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('DELETE /roles/3', () => {
    it('Should return an error if role is not admin', async () => {
      await request(app)
        .delete('/roles/3')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('DELETE /roles/3', () => {
    it('Should delete role if user role is admin', async () => {
      await request(app)
        .delete('/roles/3')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
});