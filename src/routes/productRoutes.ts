import { Router } from "express";
import { ProductController } from "../controllers/productController";
import { AuthController } from "../controllers/authController";


export class ProductRoutes {

    public router: Router;
    public productController: ProductController = new ProductController();
    public authController: AuthController = new AuthController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes() {
        this.router.get("/",this.authController.authenticateJWT, this.productController.getProducts);
        this.router.post("/createReport",this.authController.authenticateJWT, this.productController.createReport);
        this.router.post("/", this.authController.authenticateJWT, this.productController.createProduct);
        this.router.put("/:name", this.authController.authenticateJWT, this.productController.updateProduct);
        this.router.delete("/:name", this.authController.authenticateJWT, this.productController.deleteProduct);
    }
}