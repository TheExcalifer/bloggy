import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { connection, connect } from 'mongoose';
describe('/auth', () => {
  let app: INestApplication;

  const user = {
    fullName: 'lorem ipsum',
    username: 'lorem',
    password: 'loremipsum',
  };

  beforeAll(async () => {
    await connect(process.env.MONGO_TEST);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('/signup', () => {
    it('POST - Signup User', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(201);
    });
    it('POST - Duplicate User', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(user)
        .expect(409);
    });
  });

  describe('/login', () => {
    it('POST - Login User', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send(user)
        .expect(200);
    });
    it('POST - it shoud be return access_token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);
      expect(response.body).toHaveProperty('access_token');
    });
    it('POST - Incorrect user credential', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({ ...user, password: 'wrong password' })
        .expect(401);
    });
  });

  afterAll(async () => {
    await connection.db.dropDatabase();
  });
});
