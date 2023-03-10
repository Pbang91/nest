import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  //beforeEach에서 변경
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();
  });

  it('/ (GET) 200', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Welcome to my Movie API');
  });

  describe("/movies", () => {
    it('GET 200', () => {
      return request(app.getHttpServer())
        .get("/movies")
        .expect(200)
        .expect([]);
    });

    it('POST 201', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Title test',
          year: 2000,
          genres: ['test']
        })
        .expect(201)
    });

    it('DELETE', () => {
      return request(app.getHttpServer())
        .delete('/moives')
        .expect(404)
    });
  });

  describe('/movies/:id', () => {
    it("GET", () => {
      return request(app.getHttpServer())
        .get("/movies/1")
        .expect(200)
        .expect({
          id: 1,
          title: 'Title test',
          year: 2000,
          genres: ['test']
        })
    });

    it('GET 404', () => {
      return request(app.getHttpServer())
        .get('/movies/1000')
        .expect(404)
    });
    
    it('PATCH 200', () => {
      return request(app.getHttpServer())
        .patch('/movies/1')
        .send({title: "Updated Test"})
        .expect(200)
    });
    
    it('DELETE 200', () => {
      return request(app.getHttpServer())
        .delete('/movies/1')
        .expect(200)
    });
    
    it('POST 400', () => {
      return request(app.getHttpServer())
        .post('/movies')
        .send({
          title: 'Title test',
          year: 2000,
          genres: ['test'],
          other: 'thing'
        })
        .expect(400)
    });
  });
});
