import express from 'express';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import { Controller } from '@core/infrastructure/Controller';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: Controller[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(cors());
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

export default App;
