const request = require('supertest');
const app = require('../app');
const TokenService = require('../services/token.service');

describe('Comments EndPoints', () => {
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
  describe('GET /comments', () => {
    it('Should fetch all comments', async () => {
      await request(app)
        .get('/comments')
        .expect('Content-Type', /json/)
        .expect(200);
    })
  });

  describe('GET /comments/1', () => {
    it('Should fetch admin comment', async () => {
      await request(app)
        .get('/comments/1')
        .expect('Content-Type', /json/)
        .expect(200)
        .then(res => {
          expect(res.body.id).toEqual(1)
          expect(res.body.UserId)
          expect(res.body.content)
        });
    })
  });

  // POST LIST
  describe('POST /comments', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .post('/comments')
        .send({
          'PictureId': 1,
          'content': 'Comment added without JWT'
        })
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('POST /comments', () => {
    it('Should insert comment if JWT', async () => {
      await request(app)
        .post('/comments')
        .set('Authorization', 'Bearer ' + userToken)
        .send({
          'PictureId': 1,
          'content': 'Comment added by ' + user.username
        })
        .expect('Content-Type', /json/)
        .expect(201)
    })
  })

  describe('POST /comments', () => {
    it('Should return error if bad fields', async () => {
      await request(app)
        .post('/comments')
        .set('Authorization', 'Bearer ' + userToken)
        .send({
          // 'PictureId': 1,
          'content': 'Comment added by ' + user.username
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })
  })

  describe('POST /comments', () => {
    it('Should return error if bad fields', async () => {
      await request(app)
        .post('/comments')
        .set('Authorization', 'Bearer ' + userToken)
        .send({
          'PictureId': 1,
          // 'content': 'Comment added by ' + user.username
        })
        .expect('Content-Type', /json/)
        .expect(400)
    })
  })

  // PUT
  describe('PUT /comments/3', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .put('/comments/3')
        .send({ 'content': 'Comment edited without JWT' })
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('PUT /comments/1', () => {
    it('Should return an error if comment.UerId != token.id', async () => {
      await request(app)
        .put('/comments/1')
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'content': 'Comment edited by ' + user.username })
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('PUT /comments/3', () => {
    it('Should update comment if comment.UserId == token.id', async () => {
      await request(app)
        .put('/comments/3')
        .set('Authorization', 'Bearer ' + userToken)
        .send({ 'content': 'Comment edited by ' + user.username })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('PUT /comments/2', () => {
    it('Should update comment if token.role == admin', async () => {
      await request(app)
        .put('/comments/2')
        .set('Authorization', 'Bearer ' + adminToken)
        .send({ 'content': 'Comment edited by ' + admin.username })
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  // DELETE
  describe('DELETE /comments/3', () => {
    it('Should return an error if not JWT', async () => {
      await request(app)
        .delete('/comments/3')
        .expect('Content-Type', /json/)
        .expect(401)
    })
  })

  describe('DELETE /comments/1', () => {
    it('Should return an error if comment.UserId != token.id', async () => {
      await request(app)
        .delete('/comments/1')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(403)
    })
  })

  describe('DELETE /comments/3', () => {
    it('Should delete comment if comment.UserId == token.id', async () => {
      await request(app)
        .delete('/comments/3')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('DELETE /comments/2', () => {
    it('Should delete comment if token.role == admin', async () => {
      await request(app)
        .delete('/comments/2')
        .set('Authorization', 'Bearer ' + adminToken)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })
});