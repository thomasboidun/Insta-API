const request = require('supertest');
const app = require('../app');
const TokenService = require('../services/token.service');

describe('Users EndPoints', () => {
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

  const test = {
    username: 'user.test',
    email: 'user.test@instaapi.lan',
    password: 'test',
    Role: { id: 2, name: 'user' }
  };

  const adminToken = TokenService.generateToken(admin);
  const userToken = TokenService.generateToken(user);

  // GET List
  describe('GET /users', () => {
    it('Should fetch all users', async () => {
      await request(app)
        .get('/users')
        .expect('Content-Type', /json/)
        .expect(200);
    })
  });

  describe('GET /users/' + user.id, () => {
    it('Should fetch the user where id = ' + user.id, async () => {
      await request(app)
        .get('/users/' + user.id)
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => { expect(res.body.id).toEqual(user.id) });
    })
  });

  // POST List
  describe('POST /users', () => {
    it('Should return HTTP code 400 if required field is missing', async () => {
      await request(app)
        .post('/users')
        .send({ 'username': test.username, 'password': test.username, }) // email and role missing
        .expect('Content-Type', /json/)
        .expect(400)
        .then(res => { expect(res.body.error).toEqual('Can\'t add, bad fields. Check the documentation') })
    })
  })

  describe('POST /users', () => {
    it('Should insert the new user', async () => {
      await request(app)
        .post('/users')
        .send({ 'username': test.username, 'email': test.email, 'password': test.password, 'RoleId': test.Role.id })
        .expect('Content-Type', /json/)
        .expect(201)
        .then(res => {
          expect(res.body.id);
          expect(res.body.username).toEqual(test.username);
          expect(res.body.email).toEqual(test.email);
          expect(res.body.password);
          expect(res.body.RoleId).toEqual(test.Role.id);
        })
    })
  })

  describe('POST /users', () => {
    it('Should return HTTP code 403 if username already exist', async () => {
      await request(app)
        .post('/users')
        .send({ 'username': test.username, 'email': test.email, 'password': test.password, 'RoleId': test.Role.id })
        .expect('Content-Type', /json/)
        .expect(403)
        .then(res => { expect(res.body.error).toEqual('Duplicate entry. Impossible to add') })

    })
  })

  describe('POST /users', () => {
    it('Should return HTTP code 403 if email already exist', async () => {
      await request(app)
        .post('/users')
        .send({ 'username': test.username, 'email': test.email, 'password': test.password, 'RoleId': test.Role.id })
        .expect('Content-Type', /json/)
        .expect(403)
        .then(res => { expect(res.body.error).toEqual('Duplicate entry. Impossible to add') })
    })
  })

  describe('POST /users/login', () => {
    it('Should fetch token', async () => {
      await request(app)
        .post('/users/login')
        .send({ 'username': test.username, 'password': test.password })
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.token);
        })
    })
  })

  describe('POST /users/login', () => {
    it('Should fetch HTTP code 404 credential error (password)', async () => {
      await request(app)
        .post('/users/login')
        .send({ 'username': test.username, 'password': 'WRONG' })
        .expect('Content-Type', /json/)
        .expect(404)
        .then(res => {
          expect(res.body.error).toEqual('Credential error');
        })
    })
  })

  describe('POST /users/login', () => {
    it('Should fetch HTTP code 404 credential error (username)', async () => {
      await request(app)
        .post('/users/login')
        .send({ 'username': 'WRONG', 'password': test.password })
        .expect('Content-Type', /json/)
        .expect(404)
        .then(res => {
          expect(res.body.error).toEqual('Credential error');
        })
    })
  })

  // PUT List
  describe('PUT /users/' + test.id, () => {
    it('Should return an HTTP code 401 if JWT missing', async () => {
      await request(app)
        .put('/users/3')
        .send({ 'username': test.username + ' (Edited without JWT)' })
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('PUT /users/' + test.id, () => {
    it('Should return HTTP code 403 if {token.role} != \'admin\' && {token.id} != {user.id}', async () => {
      await request(app)
        .put('/users/' + test.id)
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'username': test.username + ' (Edited by ' + user.username + ')' })
        .expect('Content-Type', /json/)
        .expect(403)
        .then(res => expect(res.body.error).toEqual('No permision'));
    })
  })

  describe('PUT /users/' + user.id, () => {
    it('Should update user if token.id == user.id', async () => {
      await request(app)
        .put('/users/' + user.id)
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'username': `${user.username} (Edited by ${user.username})` })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('PUT /users/' + test.id, () => {
    it('Should update user if {token.role} == \'admin\'', async () => {
      await request(app)
        .put('/users/' + test.id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'username': `${test.username} (Edited by ${admin.username})` })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('PUT /users/' + user.id, () => {
    it('Should return error if user.username already exist', async () => {
      await request(app)
        .put('/users/' + user.id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'username': admin.username })
        .expect(403)
        .then(res => expect(res.body.error).toEqual('Duplicate entry. Impossible to add'))
    })
  })

  describe('PUT /users' + user.id, () => {
    it('Should return error if user.email already exist', async () => {
      await request(app)
        .put('/users/' + user.id)
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'email': admin.email })
        .expect(403)
        .then(res => expect(res.body.error).toEqual('Duplicate entry. Impossible to add'))
    })
  })

  // DELETE List
  describe('DELETE /users/' + test.id, () => {
    it('Should return an HTTP code 401 if JWT missing', async () => {
      await request(app)
        .delete('/users/' + test.id)
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('DELETE /users/' + test.id, () => {
    it('Should return an HTTP code 403 if {token.role} != \'admin\' && {token.id} != {user.id}', async () => {
      await request(app)
        .delete('/users/' + test.id)
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(403)
        .then(res => { expect(res.body.error).toEqual('No permision') })
    })
  })

  describe('DELETE /users/' + user.id, () => {
    it('Should delete user if token.id == user.id', async () => {
      await request(app)
        .delete('/users/' + user.id)
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('DELETE /users/' + test.id, () => {
    it('Should delete user if token.role == \'admin\'', async () => {
      await request(app)
        .delete('/users/' + test.id)
        .set('Authorization', 'Bearer ' + adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
});